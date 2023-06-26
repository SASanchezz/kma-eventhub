import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { NotFoundException } from '@nestjs/common';
import * as fsExtra from 'fs-extra';
import * as fs from 'fs';

jest.mock('fs-extra');

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadService],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  describe('getPhoto', () => {
    it('should return the photo stream for a valid filename', async () => {
      const filename = 'photo.jpg';
      const fileStream = {} as fsExtra.ReadStream;

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fsExtra, 'createReadStream').mockReturnValue(fileStream);

      const result = await service.getPhoto(filename);

      expect(fs.existsSync).toBeCalledWith(expect.any(String));
      expect(fsExtra.createReadStream).toBeCalledWith(expect.any(String));
      expect(result).toBe(fileStream);
    });

    it('should throw NotFoundException for an invalid filename', async () => {
      const filename = 'invalid.jpg';

      jest.spyOn(fs, 'existsSync').mockReturnValue(false);

      await expect(service.getPhoto(filename)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if an error occurs while reading the file', async () => {
      const filename = 'photo.jpg';

      jest.spyOn(fs, 'existsSync').mockReturnValue(false);
      jest.spyOn(fsExtra, 'createReadStream').mockImplementation(() => {
        throw new Error('File read error');
      });

      await expect(service.getPhoto(filename)).rejects.toThrow(NotFoundException);
    });
  });
});
