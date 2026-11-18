import React from 'react';

/**
 * Komponen StudentTable
 * Bertugas menampilkan data mahasiswa dalam format tabel akademik yang rapi dan terstruktur.
 * Menerima props `students` yang merupakan array data mahasiswa dari backend PostgreSQL.
 */
function StudentTable({ students }) {
  return (
    <div className="table-responsive">
      <table className="student-table">
        <thead>
          <tr>
            <th>No</th>
            <th>NIM</th>
            <th>Nama Mahasiswa</th>
            <th>Program Studi</th>
            <th>Angkatan</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id}>
              <td className="text-center cell-number">{index + 1}</td>
              <td className="cell-nim">{student.nim}</td>
              <td className="cell-name">{student.name}</td>
              <td className="cell-prodi">{student.studyProgram}</td>
              <td className="text-center cell-year">
                <span className="badge-year">{student.entryYear}</span>
              </td>
              <td className="cell-email">
                <a href={`mailto:${student.email}`}>{student.email}</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;
