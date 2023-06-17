import { Controller, Get, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { createFileUrl } from 'src/utils/paths';

@Controller('uploads')
export class UploadController {
  constructor(private readonly photoService: UploadService) {}

  @Get(':filename')
  async getPhoto(@Param('filename') filename: string, @Res() res: Response): Promise<void> {
    const fileStream = await this.photoService.getPhoto(filename);
    fileStream.pipe(res);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(@Req() req: Request, @UploadedFile() file: Express.Multer.File): Promise<string> {
    return createFileUrl(req, file.filename);
  }
}
