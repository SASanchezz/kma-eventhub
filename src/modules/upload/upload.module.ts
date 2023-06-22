import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { OneDriveService } from '../onedrive/onedrive.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './src/images', // Specifies the destination directory for temporary file uploads
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService, OneDriveService],
})
export class UploadModule {}
