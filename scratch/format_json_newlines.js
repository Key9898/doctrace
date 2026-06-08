import fs from "fs";

const filePath = "./samples/sample-bank-statements.json";
const bankData = JSON.parse(fs.readFileSync(filePath, "utf8"));

for (const doc of bankData.documents) {
  for (const page of doc.pages) {
    if (page.text) {
      // Replace spaces before dates with newlines to place each transaction on its own line
      page.text = page.text.replace(/ (2026-05-\d{2})/g, "\n$1");
      console.log(
        `Updated text for ${doc.fileName}, preview:`,
        page.text.slice(0, 300),
      );
    }
  }
}

fs.writeFileSync(filePath, JSON.stringify(bankData, null, 2), "utf8");
console.log("Updated sample-bank-statements.json successfully!");
