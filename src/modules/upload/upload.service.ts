import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs-extra';
import { existsSync } from 'fs';
import { getUploadsPath } from 'src/utils/paths';

@Injectable()
export class UploadService {

  async getPhoto(filename: string): Promise<fs.ReadStream> {
    const filePath = getUploadsPath(filename);

    const fileExists = existsSync(filePath);
    if (!fileExists) {
      throw new NotFoundException('Photo not found');
    }

    try {
      const fileStream = fs.createReadStream(filePath);
      return fileStream;
    } catch (error) {
      throw new NotFoundException('Photo not found');
    }
  }

}
