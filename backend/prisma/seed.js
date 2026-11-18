import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const studentsData = [
  {
    nim: '103022400001',
    name: 'Ahmad Fauzi',
    studyProgram: 'S1 Rekayasa Perangkat Lunak',
    entryYear: 2024,
    email: 'ahmadfauzi@student.telkomuniversity.ac.id',
  },
  {
    nim: '103022400012',
    name: 'Bunga Citra Lestari',
    studyProgram: 'S1 Rekayasa Perangkat Lunak',
    entryYear: 2024,
    email: 'bungacitra@student.telkomuniversity.ac.id',
  },
  {
    nim: '103022400025',
    name: 'Chandra Wicaksono',
    studyProgram: 'S1 Rekayasa Perangkat Lunak',
    entryYear: 2024,
    email: 'chandraw@student.telkomuniversity.ac.id',
  },
  {
    nim: '103022300044',
    name: 'Daffa Rizky Pratama',
    studyProgram: 'S1 Rekayasa Perangkat Lunak',
    entryYear: 2023,
    email: 'daffarizky@student.telkomuniversity.ac.id',
  },
  {
    nim: '103022300058',
    name: 'Elvira Nabila Putri',
    studyProgram: 'S1 Rekayasa Perangkat Lunak',
    entryYear: 2023,
    email: 'elviranabila@student.telkomuniversity.ac.id',
  },
  {
    nim: '103022200071',
    name: 'Farhan Maulana',
    studyProgram: 'S1 Rekayasa Perangkat Lunak',
    entryYear: 2022,
    email: 'farhanm@student.telkomuniversity.ac.id',
  },
  {
    nim: '103022200089',
    name: 'Gita Saraswati',
    studyProgram: 'S1 Rekayasa Perangkat Lunak',
    entryYear: 2022,
    email: 'gitasaraswati@student.telkomuniversity.ac.id',
  },
  {
    nim: '103022100102',
    name: 'Hadi Prasetyo',
    studyProgram: 'S1 Rekayasa Perangkat Lunak',
    entryYear: 2021,
    email: 'hadiprasetyo@student.telkomuniversity.ac.id',
  },
  {
    nim: '103022100115',
    name: 'Indah Permatasari',
    studyProgram: 'S1 Rekayasa Perangkat Lunak',
    entryYear: 2021,
    email: 'indahpermatasari@student.telkomuniversity.ac.id',
  },
  {
    nim: '103022000130',
    name: 'Joko Susilo',
    studyProgram: 'S1 Rekayasa Perangkat Lunak',
    entryYear: 2020,
    email: 'jokosusilo@student.telkomuniversity.ac.id',
  },
  {
    nim: '103022400142',
    name: 'Kevin Jonathan',
    studyProgram: 'S1 Rekayasa Perangkat Lunak',
    entryYear: 2024,
    email: 'kevinj@student.telkomuniversity.ac.id',
  },
  {
    nim: '103022300155',
    name: 'Larasati Dewi',
    studyProgram: 'S1 Rekayasa Perangkat Lunak',
    entryYear: 2023,
    email: 'larasatidewi@student.telkomuniversity.ac.id',
  },
];

async function main() {
  console.log('Menjalankan database seed untuk Student Directory...');

  // Bersihkan data lama jika ada agar tidak terjadi duplikasi NIM
  await prisma.student.deleteMany();

  for (const student of studentsData) {
    await prisma.student.create({
      data: student,
    });
  }

  const count = await prisma.student.count();
  console.log(`Berhasil memasukkan ${count} data mahasiswa ke database PostgreSQL.`);
}

main()
  .catch((e) => {
    console.error('Error saat seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
