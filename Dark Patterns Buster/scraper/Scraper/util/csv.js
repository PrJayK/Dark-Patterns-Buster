const { parse } = require('csv/sync');
const fs = require('fs');

const readCsv = (pathToCsv) => {
  const csvData = fs.readFileSync(pathToCsv, 'utf8');
  const records = parse(csvData);
  return records;
};

module.exports = { readCsv };
