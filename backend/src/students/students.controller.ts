import { Controller, Get, Param } from '@nestjs/common';
import { StudentsService } from './students.service.js';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  /**
   * Endpoint GET /students
   * Mengembalikan seluruh data mahasiswa dalam format JSON
   */
  @Get()
  async findAll() {
    return this.studentsService.findAll();
  }

  /**
   * Endpoint GET /students/:id
   * Mengembalikan satu data mahasiswa berdasarkan ID (UUID)
   * Mengembalikan 404 jika ID tidak ditemukan
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }
}
