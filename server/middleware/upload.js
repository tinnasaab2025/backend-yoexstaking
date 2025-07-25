
import multer from 'multer';

const storage = multer.memoryStorage(); // store in memory (not disk)
const upload = multer({ storage });

export default upload;
