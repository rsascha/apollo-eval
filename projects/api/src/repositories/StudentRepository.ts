import { DatabaseSync } from "node:sqlite";

export interface Student {
  id: number;
  name: string;
  email?: string;
}

export interface CreateStudentInput {
  name: string;
  email?: string;
}

export class StudentRepository {
  private db: DatabaseSync;

  constructor(db: DatabaseSync) {
    this.db = db;
  }

  findAll(): Student[] {
    const stmt = this.db.prepare("SELECT * FROM students");
    return stmt.all() as Student[];
  }

  findById(id: number): Student | undefined {
    const stmt = this.db.prepare("SELECT * FROM students WHERE id = ?");
    return stmt.get(id) as Student | undefined;
  }

  findByName(name: string): Student[] {
    const stmt = this.db.prepare("SELECT * FROM students WHERE name LIKE ?");
    return stmt.all(`%${name}%`) as Student[];
  }

  create(input: CreateStudentInput): Student {
    const stmt = this.db.prepare(
      "INSERT INTO students (name, email) VALUES (?, ?) RETURNING *"
    );
    return stmt.get(input.name, input.email) as Student;
  }

  update(id: number, input: Partial<CreateStudentInput>): Student | undefined {
    const existingStudent = this.findById(id);
    if (!existingStudent) return undefined;

    const fields = [];
    const values = [];

    if (input.name !== undefined) {
      fields.push("name = ?");
      values.push(input.name);
    }
    if (input.email !== undefined) {
      fields.push("email = ?");
      values.push(input.email);
    }

    if (fields.length === 0) return existingStudent;

    values.push(id);
    const stmt = this.db.prepare(
      `UPDATE students SET ${fields.join(", ")} WHERE id = ? RETURNING *`
    );
    return stmt.get(...values) as Student;
  }

  delete(id: number): boolean {
    const stmt = this.db.prepare("DELETE FROM students WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
