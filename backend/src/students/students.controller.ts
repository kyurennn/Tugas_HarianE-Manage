import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { StudentsService } from './students.service.js';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('entryYear') entryYear?: string,
  ) {
    let parsedYear: number | undefined;

    if (entryYear !== undefined && entryYear !== '') {
      parsedYear = Number(entryYear);
      if (!Number.isInteger(parsedYear)) {
        throw new BadRequestException('Parameter entryYear harus berupa angka');
      }
    }

    return this.studentsService.findAll({
      search: search?.trim() || undefined,
      entryYear: parsedYear,
    });
  }

  @Get('stats')
  async getStats() {
    return this.studentsService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}
