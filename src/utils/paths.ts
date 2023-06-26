import * as path from 'path';

const FILE_IMAGES_FOLDER = path.resolve('../../images');

export const getUploadsPath = (filename = ''): string => {
  return path.join(FILE_IMAGES_FOLDER, filename);
};

export const createFileUrl = (req: any, fileName: string): string => {
  return `https://${req.headers.host}/api/v1/uploads/${fileName}`;
};
