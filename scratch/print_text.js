import fs from "fs";
const data = JSON.parse(
  fs.readFileSync("./samples/sample-bank-statements.json", "utf8"),
);
console.log("Text field for document 0 page 0:");
console.log(JSON.stringify(data.documents[0].pages[0].text));
