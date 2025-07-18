import { DatabaseSync } from "node:sqlite";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { unlinkSync, existsSync } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, "db.sqlite");

if (existsSync(dbPath)) {
  unlinkSync(dbPath);
  console.log("Existing database file removed");
}

const db = new DatabaseSync(dbPath);
db.exec(`
  CREATE TABLE teachers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    area TEXT
  )
`);

db.exec(`
  CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    duration_hours INTEGER,
    teacher_id INTEGER NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
  )
`);

db.exec(`
  CREATE TABLE lessons (
    course_id INTEGER,
    sequence_number INTEGER,
    title TEXT NOT NULL,
    content TEXT,
    PRIMARY KEY (course_id, sequence_number),
    FOREIGN KEY (course_id) REFERENCES courses(id)
  )
`);

db.exec(`
  CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT
  )
`);

db.exec(`
  CREATE TABLE courses_students (
    course_id INTEGER,
    student_id INTEGER,
    PRIMARY KEY (course_id, student_id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (student_id) REFERENCES students(id)
  )
`);

db.exec(`
  CREATE TABLE lessons_students (
    course_id INTEGER,
    sequence_number INTEGER,
    student_id INTEGER,
    finished DATE NOT NULL,
    PRIMARY KEY (course_id, sequence_number, student_id),
    FOREIGN KEY (course_id, sequence_number) REFERENCES lessons(course_id, sequence_number),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id, student_id) REFERENCES courses_students(course_id, student_id)
  )
`);

console.log(`Database schema created successfully at: ${dbPath}`);

const insertTeacher = db.prepare(
  "INSERT INTO teachers (id, name, area) VALUES (?, ?, ?)"
);
insertTeacher.run(1, "Dr. Schmidt", "Computer Science");
insertTeacher.run(2, "Prof. Müller", "Mathematics");
insertTeacher.run(3, "Ms. Weber", "Physics");

const insertStudent = db.prepare(
  "INSERT INTO students (id, name, email) VALUES (?, ?, ?)"
);
insertStudent.run(1, "Max Mustermann", "max@example.com");
insertStudent.run(2, "Anna Schmidt", "anna@example.com");
insertStudent.run(3, "Tom Weber", "tom@example.com");

const insertCourse = db.prepare(
  "INSERT INTO courses (title, description, duration_hours, teacher_id) VALUES (?, ?, ?, ?)"
);
insertCourse.run(
  "Introduction to Programming",
  "Learn the basics of programming with TypeScript",
  40,
  1
);
insertCourse.run("Advanced Mathematics", "Calculus and Linear Algebra", 60, 2);
insertCourse.run("Physics Fundamentals", "Basic principles of physics", 30, 3);

const courses = db.prepare("SELECT id, title FROM courses").all();
console.log("Created courses:", courses);

const insertLesson = db.prepare(
  "INSERT INTO lessons (course_id, sequence_number, title, content) VALUES (?, ?, ?, ?)"
);
insertLesson.run(
  1,
  1,
  "Variables and Data Types",
  "Introduction to variables, strings, numbers, and booleans"
);
insertLesson.run(1, 2, "Functions", "How to create and use functions");
insertLesson.run(
  1,
  3,
  "Objects and Arrays",
  "Working with complex data structures"
);

const insertEnrollment = db.prepare(
  "INSERT INTO courses_students (course_id, student_id) VALUES (?, ?)"
);
insertEnrollment.run(1, 1); // Max in Programming
insertEnrollment.run(1, 2); // Anna in Programming
insertEnrollment.run(2, 2); // Anna in Mathematics
insertEnrollment.run(3, 3); // Tom in Physics

const insertCompletion = db.prepare(
  "INSERT INTO lessons_students (course_id, sequence_number, student_id, finished) VALUES (?, ?, ?, ?)"
);
insertCompletion.run(1, 1, 1, "2025-07-15"); // Max completed lesson 1
insertCompletion.run(1, 1, 2, "2025-07-16"); // Anna completed lesson 1
insertCompletion.run(1, 2, 1, "2025-07-17"); // Max completed lesson 2

console.log("Sample data inserted successfully!");

console.log("\n--- Database Contents ---");

console.log("\nTeachers:");
const teachers = db.prepare("SELECT * FROM teachers").all();
teachers.forEach((teacher) =>
  console.log(`  ${teacher.id}: ${teacher.name} (${teacher.area})`)
);

console.log("\nStudents:");
const students = db.prepare("SELECT * FROM students").all();
students.forEach((student) =>
  console.log(`  ${student.id}: ${student.name} (${student.email})`)
);

console.log("\nCourses with Teachers:");
const coursesWithTeachers = db
  .prepare(
    `
  SELECT c.id, c.title, c.duration_hours, t.name as teacher_name 
  FROM courses c 
  JOIN teachers t ON c.teacher_id = t.id
`
  )
  .all();
coursesWithTeachers.forEach((course) =>
  console.log(
    `  ${course.id}: ${course.title} - ${course.duration_hours}h (Teacher: ${course.teacher_name})`
  )
);

console.log("\nCourse Enrollments:");
const enrollments = db
  .prepare(
    `
  SELECT c.title, s.name as student_name 
  FROM courses_students cs
  JOIN courses c ON cs.course_id = c.id
  JOIN students s ON cs.student_id = s.id
`
  )
  .all();
enrollments.forEach((enrollment) =>
  console.log(`  ${enrollment.student_name} -> ${enrollment.title}`)
);

console.log("\nLesson Completions:");
const completions = db
  .prepare(
    `
  SELECT c.title as course_title, l.title as lesson_title, s.name as student_name, ls.finished
  FROM lessons_students ls
  JOIN lessons l ON ls.course_id = l.course_id AND ls.sequence_number = l.sequence_number
  JOIN courses c ON ls.course_id = c.id
  JOIN students s ON ls.student_id = s.id
`
  )
  .all();
completions.forEach((completion) =>
  console.log(
    `  ${completion.student_name} completed "${completion.lesson_title}" in ${completion.course_title} on ${completion.finished}`
  )
);

db.close();
