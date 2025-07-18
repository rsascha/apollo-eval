import { DatabaseSync } from "node:sqlite";

export interface CourseStudent {
  course_id: number;
  student_id: number;
}

export interface CreateCourseStudentInput {
  course_id: number;
  student_id: number;
}

export class CourseStudentRepository {
  private db: DatabaseSync;

  constructor(db: DatabaseSync) {
    this.db = db;
  }

  findAll(): CourseStudent[] {
    const stmt = this.db.prepare("SELECT * FROM courses_students");
    return stmt.all() as CourseStudent[];
  }

  findByCourseId(courseId: number): CourseStudent[] {
    const stmt = this.db.prepare(
      "SELECT * FROM courses_students WHERE course_id = ?"
    );
    return stmt.all(courseId) as CourseStudent[];
  }

  findByStudentId(studentId: number): CourseStudent[] {
    const stmt = this.db.prepare(
      "SELECT * FROM courses_students WHERE student_id = ?"
    );
    return stmt.all(studentId) as CourseStudent[];
  }

  findById(courseId: number, studentId: number): CourseStudent | undefined {
    const stmt = this.db.prepare(
      "SELECT * FROM courses_students WHERE course_id = ? AND student_id = ?"
    );
    return stmt.get(courseId, studentId) as CourseStudent | undefined;
  }

  create(input: CreateCourseStudentInput): CourseStudent {
    const stmt = this.db.prepare(
      "INSERT INTO courses_students (course_id, student_id) VALUES (?, ?) RETURNING *"
    );
    return stmt.get(input.course_id, input.student_id) as CourseStudent;
  }

  delete(courseId: number, studentId: number): boolean {
    const stmt = this.db.prepare(
      "DELETE FROM courses_students WHERE course_id = ? AND student_id = ?"
    );
    const result = stmt.run(courseId, studentId);
    return result.changes > 0;
  }

  getStudentsForCourse(courseId: number) {
    const stmt = this.db.prepare(`
      SELECT s.* FROM students s
      JOIN courses_students cs ON s.id = cs.student_id
      WHERE cs.course_id = ?
    `);
    return stmt.all(courseId);
  }

  getCoursesForStudent(studentId: number) {
    const stmt = this.db.prepare(`
      SELECT c.* FROM courses c
      JOIN courses_students cs ON c.id = cs.course_id
      WHERE cs.student_id = ?
    `);
    return stmt.all(studentId);
  }
}
