import fs from "fs";
const accessToken = "CFPAT-jiyixRs2tPYPtgc65DKR6F7iGbs3Mra0SbqvJ0afVhw";
const spaceID = "tckbs3t41kd5";
const environment = "master";

const bookList = JSON.parse(fs.readFileSync("./bookList.json"));

// generate image name from url
function getImageNameFromUrl(url) {
  const parts = url.split("/");
  const imageName = parts[parts.length - 1];
  return imageName;
}

const fetchAssetId = async (book) => {
  let assetResponse;
  console.log("fetching Asset Id for:", book.title);
  try {
    const response = await fetch(
      `https://api.contentful.com/spaces/tckbs3t41kd5/environments/master/assets`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/vnd.contentful.management.v1+json",
        },
        body: JSON.stringify({
          fields: {
            title: {
              "en-US": book.title,
            },
            file: {
              "en-US": {
                contentType: "image/jpeg",
                fileName: getImageNameFromUrl(book.url),
                upload: book.img,
              },
            },
          },
        }),
      },
    );

    assetResponse = await response.json();
    let assetId = assetResponse.sys.id;
    return assetId;
  } catch (err) {}
};

const createItem = async (book, assetId) => {
  book.id = { "en-US": parseInt(book.id) };
  book.title = { "en-US": book.title };
  if (book.subtitle) {
    book.subtitle = { "en-US": book.subtitle };
  }
  book.description = { "en-US": book.description };
  book.authors = { "en-US": book.authors };
  book.publisher = { "en-US": book.publisher };
  book.pages = { "en-US": parseInt(book.pages) };
  book.year = { "en-US": parseInt(book.year) };
  book.img = {
    "en-US": {
      sys: {
        type: "Link",
        linkType: "Asset",
        id: assetId,
      },
    },
  };
  book.url = { "en-US": book.url };
  try {
    const response = await fetch(
      `https://api.contentful.com/spaces/tckbs3t41kd5/environments/master/entries`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/vnd.contentful.management.v1+json",
          "X-Contentful-Content-Type": "bookItem",
        },
        body: JSON.stringify({
          fields: book,
        }),
      },
    );

    assetResponse = await response.json();
    let assetId = assetResponse.sys.id;
    return assetId;
  } catch (err) {}
  console.log(book);
  // // console.log(
  //   `creating item ${JSON.stringify(book)} with asset id: ${assetId}`,
  // );
};

let canProcess = true;

const processBook = async () => {
  if (canProcess) {
    canProcess = false;

    const assetId = await fetchAssetId(bookList[bookIndex]);
    const response = await createItem(bookList[bookIndex], assetId);
    bookIndex++;

    setTimeout(() => {
      canProcess = true;
    }, 1000); // 1000 milliseconds = 1 second
  }
};

// Assuming you have a list of books named bookList and an index variable bookIndex
let bookIndex = 0;

// Call processBook function periodically until all books are processed
const processBooksPeriodically = () => {
  if (bookIndex < bookList.length) {
    processBook(); // Call the function
  } else {
    console.log("All books processed.");
    clearInterval(intervalId); // Stop calling the function when all books are processed
  }
};

// Call the processBooksPeriodically function every second
const intervalId = setInterval(processBooksPeriodically, 1000);
