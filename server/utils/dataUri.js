import DatauriParser from 'datauri/parser.js';
import path from 'path';
const parser = new DatauriParser();

export const getDataUri = (file) => {
  if (!file || !file.originalname || !file.buffer) {
    throw new Error('Invalid file passed to getDataUri');
  }

  const extName = path.extname(file.originalname);
  return parser.format(extName, file.buffer);
};
