import { readFile } from 'fs/promises';
import path from 'path';

export async function readSingleFile(filename: string): Promise<any> {
  try {
    const filePath = path.join(__dirname, "..", "..", "test-images", filename);
    const buffer = await readFile(filePath);

    const ext = path.extname(filename).toLowerCase();
    const mimetype = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.gif': 'image/gif'
    }[ext] || 'application/octet-stream';

    return {
        fieldname: 'file',
        originalname: filename,
        encoding: '7bit',
        mimetype: mimetype,
        buffer: buffer,
        size: buffer.length,
        destination: '',
        filename: filename,
        path: filePath,
        stream: null
    };

  } catch (error) {
    console.error('Error while reading the file:', error);
    throw error;
  }
}