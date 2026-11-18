import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Student } from './entities/student.entity.js';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Mengambil seluruh data mahasiswa dari database PostgreSQL
   */
  async findAll(): Promise<Student[]> {
    return this.prisma.student.findMany({
      orderBy: {
        nim: 'asc',
      },
    });
  }

  /**
   * Mengambil satu data mahasiswa berdasarkan ID (UUID)
   * Mengembalikan HTTP 404 jika tidak ditemukan
   */
  async findOne(id: string): Promise<Student> {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException(`Mahasiswa dengan ID '${id}' tidak ditemukan`);
    }

    return student;
  }
}
