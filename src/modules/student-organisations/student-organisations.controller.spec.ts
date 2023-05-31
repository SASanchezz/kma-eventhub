import { Test, TestingModule } from '@nestjs/testing';
import { StudentOrganisationsController } from './student-organisations.controller';

describe('StudentOrganisationsController', () => {
  let controller: StudentOrganisationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentOrganisationsController],
    }).compile();

    controller = module.get<StudentOrganisationsController>(StudentOrganisationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
