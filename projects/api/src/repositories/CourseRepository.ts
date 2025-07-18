import { DatabaseSync } from "node:sqlite";

export interface Course {
  id: number;
  title: string;
  description?: string;
  duration_hours?: number;
  teacher_id: number;
}

export interface CreateCourseInput {
  title: string;
  description?: string;
  duration_hours?: number;
  teacher_id: number;
}

export class CourseRepository {
  private db: DatabaseSync;

  constructor(db: DatabaseSync) {
    this.db = db;
  }

  findAll(): Course[] {
    const stmt = this.db.prepare("SELECT * FROM courses");
    return stmt.all() as Course[];
  }

  findById(id: number): Course | undefined {
    const stmt = this.db.prepare("SELECT * FROM courses WHERE id = ?");
    return stmt.get(id) as Course | undefined;
  }

  findByTeacherId(teacherId: number): Course[] {
    const stmt = this.db.prepare("SELECT * FROM courses WHERE teacher_id = ?");
    return stmt.all(teacherId) as Course[];
  }

  create(input: CreateCourseInput): Course {
    const stmt = this.db.prepare(
      "INSERT INTO courses (title, description, duration_hours, teacher_id) VALUES (?, ?, ?, ?) RETURNING *"
    );
    return stmt.get(
      input.title,
      input.description,
      input.duration_hours,
      input.teacher_id
    ) as Course;
  }

  update(id: number, input: Partial<CreateCourseInput>): Course | undefined {
    const existingCourse = this.findById(id);
    if (!existingCourse) return undefined;

    const fields = [];
    const values = [];

    if (input.title !== undefined) {
      fields.push("title = ?");
      values.push(input.title);
    }
    if (input.description !== undefined) {
      fields.push("description = ?");
      values.push(input.description);
    }
    if (input.duration_hours !== undefined) {
      fields.push("duration_hours = ?");
      values.push(input.duration_hours);
    }
    if (input.teacher_id !== undefined) {
      fields.push("teacher_id = ?");
      values.push(input.teacher_id);
    }

    if (fields.length === 0) return existingCourse;

    values.push(id);
    const stmt = this.db.prepare(
      `UPDATE courses SET ${fields.join(", ")} WHERE id = ? RETURNING *`
    );
    return stmt.get(...values) as Course;
  }

  delete(id: number): boolean {
    const stmt = this.db.prepare("DELETE FROM courses WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
