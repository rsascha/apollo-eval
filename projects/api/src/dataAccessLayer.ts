import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import {
  CourseRepository,
  CourseStudentRepository,
  LessonRepository,
  LessonStudentRepository,
  StudentRepository,
  TeacherRepository,
} from "./repositories";

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

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}
