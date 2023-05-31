import { Controller, Param, Get, NotFoundException, Post, Body, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { StudentOrganisationsService } from './student-organisations.service';
import { StudentOrganisationDetailsDto } from './dto/student-organisations-details.dto';
import { CreateStudentOrganisationDto } from './dto/create-student-organisation.dto';
import { UpdateStudentOrganisationDto } from './dto/update-student-organisation.dto';


@ApiTags('route to manage student organisation entity')
@Controller('student-organisations')
export class StudentOrganisationsController {
  constructor(private readonly SOService: StudentOrganisationsService) {}

  @Get()
  @ApiCreatedResponse({ type: StudentOrganisationDetailsDto, isArray: true })
  async getAll(): Promise<StudentOrganisationDetailsDto[]> {
    const SOs = await this.SOService.find();

    return SOs.map(SO => SO.details);
  }

  @Get(':id')
  @ApiCreatedResponse({ type: StudentOrganisationDetailsDto })
  async getOne(@Param('id') id: number): Promise<StudentOrganisationDetailsDto> {
    const SO = await this.SOService.findOne(id);
    if (!SO) {
      throw new NotFoundException('StudentOrganisation not found');
    }
    return SO.details;
  }

  @Post('')
  async create(@Body() createStudentOrganisationDto: CreateStudentOrganisationDto): Promise<StudentOrganisationDetailsDto> {
    const SO = await this.SOService.create(createStudentOrganisationDto);

    return SO.details;
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateStudentOrganisationDto: UpdateStudentOrganisationDto): Promise<StudentOrganisationDetailsDto> {
    const SO = await this.SOService.update(id, updateStudentOrganisationDto);

    return SO.details;
  }
}
