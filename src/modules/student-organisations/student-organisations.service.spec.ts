import { Test, TestingModule } from '@nestjs/testing';
import { StudentOrganisationsService } from './student-organisations.service';

describe('StudentOrganisationsService', () => {
  let service: StudentOrganisationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentOrganisationsService],
    }).compile();

    service = module.get<StudentOrganisationsService>(StudentOrganisationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
