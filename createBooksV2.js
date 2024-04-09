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
  console.log(
    `creating item ${JSON.stringify(book)} with asset id: ${assetId}`,
  );
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
