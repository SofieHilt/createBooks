const fs = require("fs");

const getBookData = async () => {
  try {
    const response = await fetch(
      "https://www.dbooks.org/api/search/javascript",
    );
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const bookData = await response.json();
    //console.log(bookData);
    return bookData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

const getDescriptions = async (id) => {
  try {
    const response = await fetch(`https://www.dbooks.org/api/book/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const descriptions = await response.json();
    return descriptions;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

const detailedBookDescriptions = async (bookData) => {
  const detailedDescriptions = [];
  for (const book of bookData.books) {
    const description = await getDescriptions(book.id);
    //console.log(description);
    const detailedDescription = {
      id: book.id,
      title: book.title,
    };
    // Check if the key exists before adding it to the detailedDescription object
    if (book.subtitle) detailedDescription.subtitle = book.subtitle;
    if (description && description.description)
      detailedDescription.description = description.description;
    if (book.authors) detailedDescription.authors = book.authors;
    if (description && description.publisher)
      detailedDescription.publisher = description.publisher;
    if (description && description.pages)
      detailedDescription.pages = description.pages;
    if (description && description.year)
      detailedDescription.year = description.year;
    if (description && description.image)
      detailedDescription.img = description.image;
    if (description && description.url)
      detailedDescription.url = description.url;
    detailedDescriptions.push(detailedDescription);
  }
  return detailedDescriptions;
};

(async () => {
  const bookData = await getBookData();
  const detailedDescriptions = await detailedBookDescriptions(bookData);
  console.log(detailedDescriptions);

  const jsonContent = JSON.stringify(detailedDescriptions, null, 2);

  fs.writeFile("bookList.json", jsonContent, "utf8", (err) => {
    if (err) {
      console.error("Error", err);
      return;
    }
    console.log("done");
  });
})();
