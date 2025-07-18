import { DatabaseSync } from "node:sqlite";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { TeacherRepository } from "./repositories/TeacherRepository.js";
import { CourseRepository } from "./repositories/CourseRepository.js";
import { StudentRepository } from "./repositories/StudentRepository.js";
import { LessonRepository } from "./repositories/LessonRepository.js";
import { CourseStudentRepository } from "./repositories/CourseStudentRepository.js";
import { LessonStudentRepository } from "./repositories/LessonStudentRepository.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class DataAccessLayer {
  private db?: DatabaseSync;

  public teachers!: TeacherRepository;
  public courses!: CourseRepository;
  public students!: StudentRepository;
  public lessons!: LessonRepository;
  public courseStudents!: CourseStudentRepository;
  public lessonStudents!: LessonStudentRepository;

  async initialize() {
    const dbPath = join(__dirname, "database", "db.sqlite");
    this.db = new DatabaseSync(dbPath);

    this.teachers = new TeacherRepository(this.db);
    this.courses = new CourseRepository(this.db);
    this.students = new StudentRepository(this.db);
    this.lessons = new LessonRepository(this.db);
    this.courseStudents = new CourseStudentRepository(this.db);
    this.lessonStudents = new LessonStudentRepository(this.db);
  }

  async withTransaction<T>(callback: () => T): Promise<T> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    // Note: For the in-memory implementation, we don't have real transactions
    // but we can add this functionality later when needed
    return callback();
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}
