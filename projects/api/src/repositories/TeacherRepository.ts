import { DatabaseSync } from "node:sqlite";

export interface Teacher {
  id: number;
  name: string;
  area?: string;
}

export interface CreateTeacherInput {
  name: string;
  area?: string;
}

export class TeacherRepository {
  private db: DatabaseSync;

  constructor(db: DatabaseSync) {
    this.db = db;
  }

  findAll(): Teacher[] {
    const stmt = this.db.prepare("SELECT * FROM teachers");
    return stmt.all() as Teacher[];
  }

  findById(id: number): Teacher | undefined {
    const stmt = this.db.prepare("SELECT * FROM teachers WHERE id = ?");
    return stmt.get(id) as Teacher | undefined;
  }

  create(input: CreateTeacherInput): Teacher {
    const stmt = this.db.prepare(
      "INSERT INTO teachers (name, area) VALUES (?, ?) RETURNING *"
    );
    return stmt.get(input.name, input.area) as Teacher;
  }

  update(id: number, input: Partial<CreateTeacherInput>): Teacher | undefined {
    const existingTeacher = this.findById(id);
    if (!existingTeacher) return undefined;

    const fields = [];
    const values = [];

    if (input.name !== undefined) {
      fields.push("name = ?");
      values.push(input.name);
    }
    if (input.area !== undefined) {
      fields.push("area = ?");
      values.push(input.area);
    }

    if (fields.length === 0) return existingTeacher;

    values.push(id);
    const stmt = this.db.prepare(
      `UPDATE teachers SET ${fields.join(", ")} WHERE id = ? RETURNING *`
    );
    return stmt.get(...values) as Teacher;
  }

  delete(id: number): boolean {
    const stmt = this.db.prepare("DELETE FROM teachers WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
