import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { BadRequestException, Response, Request } from '@nestjs/common';
import { createReadStream } from 'fs';
import { createFileUrl } from 'src/utils/paths';

describe('UploadController', () => {
  let controller: UploadController;
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [UploadService],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    service = module.get<UploadService>(UploadService);
  });

  describe('getPhoto', () => {
    it('should return the photo stream for a given filename', async () => {
      const filename = 'photo.jpg';
      const fileStream = createReadStream('path/to/photo.jpg');
      const mockResponse = {
        pipe: jest.fn(),
      };

      jest.spyOn(service, 'getPhoto').mockResolvedValue(fileStream);

      await controller.getPhoto(filename, (mockResponse as unknown) as Response);

      expect(service.getPhoto).toBeCalledWith(filename);
      expect(mockResponse.pipe).toBeCalledWith(fileStream);
    });
  });

  describe('uploadPhoto', () => {
    it('should upload a photo and return the file URL', async () => {
      const mockRequest = {} as Request;
      const mockFile = {
        filename: 'photo.jpg',
      } as Express.Multer.File;
      const expectedResult = {
        url: createFileUrl(mockRequest, mockFile.filename),
      };

      jest.spyOn(service, 'uploadPhoto').mockResolvedValue(expectedResult);

      const result = await controller.uploadPhoto(mockRequest, mockFile);

      expect(service.uploadPhoto).toBeCalledWith(mockRequest, mockFile);
      expect(result).toEqual(expectedResult);
    });

    it('should throw BadRequestException if no file is provided', async () => {
      const mockRequest = {} as Request;
      const mockFile = null;

      await expect(controller.uploadPhoto(mockRequest, mockFile)).rejects.toThrow(BadRequestException);
    });
  });
});
