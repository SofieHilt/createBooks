//import bookList from "./bookList.json" with { type: "json" };
import fs from "fs";

// 👇️ if you use CommonJS imports, use this instead
// const fs = require('fs');

const bookList = JSON.parse(fs.readFileSync("./bookList.json"));

const fetchAssetId = (book) => {
  console.log("fetching Asset Id for:", book.title);
  let assetId = 12345;
  return assetId;
};

const createItem = (book, assetId) => {
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
        id: 12345678910,
      },
    },
  };
  book.url = { "en-US": book.url };

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
