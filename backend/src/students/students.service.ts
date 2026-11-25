import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { Student } from './entities/student.entity.js';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: {
    search?: string;
    entryYear?: number;
  }): Promise<Student[]> {
    const where: Prisma.StudentWhereInput = {};

    if (filters?.entryYear) {
      where.entryYear = filters.entryYear;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { nim: { contains: filters.search, mode: 'insensitive' } },
        { studyProgram: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.student.findMany({
      where,
      orderBy: {
        nim: 'asc',
      },
    });
  }

  async getStats() {
    const totalStudents = await this.prisma.student.count();
    const byEntryYear = await this.prisma.student.groupBy({
      by: ['entryYear'],
      _count: {
        id: true,
      },
      orderBy: {
        entryYear: 'asc',
      },
    });

    return {
      totalStudents,
      byEntryYear: byEntryYear.map((item) => ({
        entryYear: item.entryYear,
        count: item._count.id,
      })),
    };
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException(`Mahasiswa dengan ID '${id}' tidak ditemukan`);
    }

    return student;
  }

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const { nim, name, studyProgram, entryYear, email } = createStudentDto;

    if (!nim || !name || !studyProgram || !entryYear || !email) {
      throw new BadRequestException(
        'Field nim, name, studyProgram, entryYear, dan email wajib diisi',
      );
    }

    const parsedYear = Number(entryYear);
    if (!Number.isInteger(parsedYear)) {
      throw new BadRequestException('Field entryYear harus berupa angka bulat');
    }

    try {
      return await this.prisma.student.create({
        data: {
          nim: nim.trim(),
          name: name.trim(),
          studyProgram: studyProgram.trim(),
          entryYear: parsedYear,
          email: email.trim(),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(`NIM '${nim}' sudah terdaftar`);
      }
      throw error;
    }
  }

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    await this.findOne(id);

    const data: Prisma.StudentUpdateInput = {};

    if (updateStudentDto.nim !== undefined) {
      data.nim = updateStudentDto.nim.trim();
    }
    if (updateStudentDto.name !== undefined) {
      data.name = updateStudentDto.name.trim();
    }
    if (updateStudentDto.studyProgram !== undefined) {
      data.studyProgram = updateStudentDto.studyProgram.trim();
    }
    if (updateStudentDto.entryYear !== undefined) {
      const parsedYear = Number(updateStudentDto.entryYear);
      if (!Number.isInteger(parsedYear)) {
        throw new BadRequestException(
          'Field entryYear harus berupa angka bulat',
        );
      }
      data.entryYear = parsedYear;
    }
    if (updateStudentDto.email !== undefined) {
      data.email = updateStudentDto.email.trim();
    }

    try {
      return await this.prisma.student.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `NIM '${updateStudentDto.nim}' sudah terdaftar`,
        );
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string; data: Student }> {
    await this.findOne(id);

    const deleted = await this.prisma.student.delete({
      where: { id },
    });

    return {
      message: `Mahasiswa '${deleted.name}' berhasil dihapus`,
      data: deleted,
    };
  }
}
