import * as XLSX from 'xlsx';
import { promises as fs } from 'fs';

// Function to read an Excel file asynchronously
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    try {
      const workbook = XLSX.readFile(filename);
      resolve(workbook);
    } catch (error) {
      reject(error);
    }
  });
};

// Function to write data to a CSV file asynchronously
const writeFileAsync = (filename, data) => {
  return fs.writeFile(filename, data);
};

(async () => {
  try {
    // Load the Excel file
    const workbook = await readFileAsync('questions_dataset.xlsx');

    // Get the first sheet name
    const sheetName = workbook.SheetNames[0];

    // Get worksheet
    const worksheet = workbook.Sheets[sheetName];

    // Convert worksheet to CSV
    const csvData = XLSX.utils.sheet_to_csv(worksheet);

    // Write CSV data to a file
    await writeFileAsync('questions_dataset.csv', csvData);

    console.log('CSV file generated successfully');
  } catch (error) {
    console.error('Error:', error);
  }
})();
