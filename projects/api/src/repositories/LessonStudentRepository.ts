import { DatabaseSync } from "node:sqlite";

export interface LessonStudent {
  course_id: number;
  sequence_number: number;
  student_id: number;
  finished: string; // Date string
}

export interface CreateLessonStudentInput {
  course_id: number;
  sequence_number: number;
  student_id: number;
  finished: string;
}

export class LessonStudentRepository {
  private db: DatabaseSync;

  constructor(db: DatabaseSync) {
    this.db = db;
  }

  findAll(): LessonStudent[] {
    const stmt = this.db.prepare("SELECT * FROM lessons_students");
    return stmt.all() as LessonStudent[];
  }

  findByCourseId(courseId: number): LessonStudent[] {
    const stmt = this.db.prepare(
      "SELECT * FROM lessons_students WHERE course_id = ?"
    );
    return stmt.all(courseId) as LessonStudent[];
  }

  findByStudentId(studentId: number): LessonStudent[] {
    const stmt = this.db.prepare(
      "SELECT * FROM lessons_students WHERE student_id = ?"
    );
    return stmt.all(studentId) as LessonStudent[];
  }

  findById(
    courseId: number,
    sequenceNumber: number,
    studentId: number
  ): LessonStudent | undefined {
    const stmt = this.db.prepare(
      "SELECT * FROM lessons_students WHERE course_id = ? AND sequence_number = ? AND student_id = ?"
    );
    return stmt.get(courseId, sequenceNumber, studentId) as
      | LessonStudent
      | undefined;
  }

  create(input: CreateLessonStudentInput): LessonStudent {
    const stmt = this.db.prepare(
      "INSERT INTO lessons_students (course_id, sequence_number, student_id, finished) VALUES (?, ?, ?, ?) RETURNING *"
    );
    return stmt.get(
      input.course_id,
      input.sequence_number,
      input.student_id,
      input.finished
    ) as LessonStudent;
  }

  update(
    courseId: number,
    sequenceNumber: number,
    studentId: number,
    finished: string
  ): LessonStudent | undefined {
    const stmt = this.db.prepare(
      "UPDATE lessons_students SET finished = ? WHERE course_id = ? AND sequence_number = ? AND student_id = ? RETURNING *"
    );
    return stmt.get(finished, courseId, sequenceNumber, studentId) as
      | LessonStudent
      | undefined;
  }

  delete(courseId: number, sequenceNumber: number, studentId: number): boolean {
    const stmt = this.db.prepare(
      "DELETE FROM lessons_students WHERE course_id = ? AND sequence_number = ? AND student_id = ?"
    );
    const result = stmt.run(courseId, sequenceNumber, studentId);
    return result.changes > 0;
  }

  getCompletedLessonsForStudent(studentId: number) {
    const stmt = this.db.prepare(`
      SELECT ls.course_id, ls.sequence_number, ls.student_id, ls.finished, c.title as course_title
      FROM lessons_students ls
      JOIN lessons l ON l.course_id = ls.course_id AND l.sequence_number = ls.sequence_number
      JOIN courses c ON l.course_id = c.id
      WHERE ls.student_id = ?
      ORDER BY ls.finished DESC
    `);
    return stmt.all(studentId);
  }

  getStudentProgressForCourse(courseId: number, studentId: number) {
    const stmt = this.db.prepare(`
      SELECT l.*, ls.finished
      FROM lessons l
      LEFT JOIN lessons_students ls ON l.course_id = ls.course_id 
        AND l.sequence_number = ls.sequence_number 
        AND ls.student_id = ?
      WHERE l.course_id = ?
      ORDER BY l.sequence_number
    `);
    return stmt.all(studentId, courseId);
  }
}
