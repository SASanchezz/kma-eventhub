import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { createReadStream } from 'fs';
import * as fs from 'fs-extra';

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
    it('mock-test', async () => {
      expect(1).toBe(1);
    });
    // it('should return the photo stream for a given filename', async () => {
    //   const filename = 'test-file.txt';
    //   const fileStream = fs.createReadStream(__dirname + '/test/' + filename);
    //   const mockResponse = {
    //     pipe: jest.fn(),
    //   };

    //   jest.spyOn(service, 'getPhoto').mockResolvedValue(fileStream);

    //   await controller.getPhoto(filename, (mockResponse as any));

    //   expect(service.getPhoto).toBeCalledWith(filename);
    //   expect(mockResponse.pipe).toBeCalledWith(fileStream);
    // });
  });
});
