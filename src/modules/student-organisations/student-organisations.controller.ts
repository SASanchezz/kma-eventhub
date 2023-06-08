import { Controller, Param, Get, NotFoundException, Post, Body, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { StudentOrganisationsService } from './student-organisations.service';
import { StudentOrganisationDetailsDto } from './dto/student-organisations-details.dto';
import { CreateStudentOrganisationDto } from './dto/create-student-organisation.dto';
import { UpdateStudentOrganisationDto } from './dto/update-student-organisation.dto';
import { FollowOrganisationDto } from './dto/follow-student-organisation.dto';
import { GetByIdsDto } from './dto/get-by-ids.dto';


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

  @Post('get-by-ids')
  async findByIds(@Body() getByIdsDto: GetByIdsDto): Promise<StudentOrganisationDetailsDto[]> {
    const SOs = await this.SOService.findByIds(getByIdsDto);

    return SOs.map(SO => SO.details);
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

  @Post('follow')
  async follow(@Body() followOrganisationDto: FollowOrganisationDto): Promise<void> {
    await this.SOService.follow(followOrganisationDto);
  }

  @Post('unfollow')
  async unfollow(@Body() followOrganisationDto: FollowOrganisationDto): Promise<void> {
    await this.SOService.unfollow(followOrganisationDto);
  }
  
}
