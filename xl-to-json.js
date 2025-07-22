const xlsx = require("xlsx");
const fs = require("fs");

// Load the Excel file
const workbook = xlsx.readFile("master.xlsx"); // <- Replace with your file path
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert to array of objects
const rawData = xlsx.utils.sheet_to_json(sheet, { defval: "" }); // keep empty strings

// Filter out empty fields
const cleanedData = rawData.map((row) => {
  const cleanedRow = {};

  Object.entries(row).forEach(([key, value]) => {
    const trimmedKey = key.trim();
    const trimmedValue = typeof value === "string" ? value.trim() : value;

    if (trimmedKey !== "" && trimmedValue !== "") {
      cleanedRow[trimmedKey] = trimmedValue;
    }
  });

  return cleanedRow;
});

// Write to JSON file
fs.writeFileSync("projects.json", JSON.stringify(cleanedData, null, 2));
console.log("✅ JSON file created: projects.json");
