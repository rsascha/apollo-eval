import { DatabaseSync } from "node:sqlite";

export interface Lesson {
  course_id: number;
  sequence_number: number;
  title: string;
  content?: string;
}

export interface CreateLessonInput {
  course_id: number;
  sequence_number: number;
  title: string;
  content?: string;
}

export class LessonRepository {
  private db: DatabaseSync;

  constructor(db: DatabaseSync) {
    this.db = db;
  }

  findAll(): Lesson[] {
    const stmt = this.db.prepare(
      "SELECT * FROM lessons ORDER BY course_id, sequence_number"
    );
    return stmt.all() as Lesson[];
  }

  findByCourseId(courseId: number): Lesson[] {
    const stmt = this.db.prepare(
      "SELECT * FROM lessons WHERE course_id = ? ORDER BY sequence_number"
    );
    return stmt.all(courseId) as Lesson[];
  }

  findById(courseId: number, sequenceNumber: number): Lesson | undefined {
    const stmt = this.db.prepare(
      "SELECT * FROM lessons WHERE course_id = ? AND sequence_number = ?"
    );
    return stmt.get(courseId, sequenceNumber) as Lesson | undefined;
  }

  create(input: CreateLessonInput): Lesson {
    const stmt = this.db.prepare(
      "INSERT INTO lessons (course_id, sequence_number, title, content) VALUES (?, ?, ?, ?) RETURNING *"
    );
    return stmt.get(
      input.course_id,
      input.sequence_number,
      input.title,
      input.content
    ) as Lesson;
  }

  update(
    courseId: number,
    sequenceNumber: number,
    input: Partial<Omit<CreateLessonInput, "course_id" | "sequence_number">>
  ): Lesson | undefined {
    const existingLesson = this.findById(courseId, sequenceNumber);
    if (!existingLesson) return undefined;

    const fields = [];
    const values = [];

    if (input.title !== undefined) {
      fields.push("title = ?");
      values.push(input.title);
    }
    if (input.content !== undefined) {
      fields.push("content = ?");
      values.push(input.content);
    }

    if (fields.length === 0) return existingLesson;

    values.push(courseId, sequenceNumber);
    const stmt = this.db.prepare(
      `UPDATE lessons SET ${fields.join(
        ", "
      )} WHERE course_id = ? AND sequence_number = ? RETURNING *`
    );
    return stmt.get(...values) as Lesson;
  }

  delete(courseId: number, sequenceNumber: number): boolean {
    const stmt = this.db.prepare(
      "DELETE FROM lessons WHERE course_id = ? AND sequence_number = ?"
    );
    const result = stmt.run(courseId, sequenceNumber);
    return result.changes > 0;
  }
}
