import { BadRequestException, Controller, Get, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { UploadService } from './upload.service';
import { createFileUrl } from '../../utils/paths';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { UploadFileDto } from './dto/upload-file.dto';

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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({ type: UploadFileDto })
  async uploadPhoto(@Req() req: Request, @UploadedFile() file: Express.Multer.File): Promise<UploadFileDto> {
    if (!file) {
      throw new BadRequestException('File field is empty')
    }

    return {
      url: createFileUrl(req, file.filename)
    }
  }
}
