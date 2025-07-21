import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { DataAccessLayer } from "./dataAccessLayer";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";

const typesArray = loadFilesSync("./src/schema/**/*.graphql");
const typeDefs = mergeTypeDefs(typesArray);

const dal = new DataAccessLayer();
await dal.initialize();

const resolvers = {
  Query: {
    teachers: () => dal.teachers.findAll(),
    teacher: (_: any, { id }: { id: number }) => dal.teachers.findById(id),
    courses: () => dal.courses.findAll(),
    course: (_: any, { id }: { id: number }) => dal.courses.findById(id),
    students: () => dal.students.findAll(),
    student: (_: any, { id }: { id: number }) => dal.students.findById(id),
    lessons: () => dal.lessons.findAll(),
    lessonsByCourse: (_: any, { courseId }: { courseId: number }) =>
      dal.lessons.findByCourseId(courseId),
    enrollments: () => dal.courseStudents.findAll(),
    completions: () => dal.lessonStudents.findAll(),
    studentProgress: (
      _: any,
      { courseId, studentId }: { courseId: number; studentId: number }
    ) => dal.lessonStudents.getStudentProgressForCourse(courseId, studentId),
  },

  Mutation: {
    createTeacher: (_: any, { input }: { input: any }) =>
      dal.teachers.create(input),
    updateTeacher: (_: any, { id, input }: { id: number; input: any }) =>
      dal.teachers.update(id, input),
    deleteTeacher: (_: any, { id }: { id: number }) => dal.teachers.delete(id),

    createCourse: (_: any, { input }: { input: any }) =>
      dal.courses.create(input),
    updateCourse: (_: any, { id, input }: { id: number; input: any }) =>
      dal.courses.update(id, input),
    deleteCourse: (_: any, { id }: { id: number }) => dal.courses.delete(id),

    createStudent: (_: any, { input }: { input: any }) =>
      dal.students.create(input),
    updateStudent: (_: any, { id, input }: { id: number; input: any }) =>
      dal.students.update(id, input),
    deleteStudent: (_: any, { id }: { id: number }) => dal.students.delete(id),

    createLesson: (_: any, { input }: { input: any }) =>
      dal.lessons.create(input),
    updateLesson: (
      _: any,
      {
        courseId,
        sequenceNumber,
        title,
        content,
      }: {
        courseId: number;
        sequenceNumber: number;
        title?: string;
        content?: string;
      }
    ) => dal.lessons.update(courseId, sequenceNumber, { title, content }),
    deleteLesson: (
      _: any,
      { courseId, sequenceNumber }: { courseId: number; sequenceNumber: number }
    ) => dal.lessons.delete(courseId, sequenceNumber),

    enrollStudent: (_: any, { input }: { input: any }) =>
      dal.courseStudents.create(input),
    unenrollStudent: (
      _: any,
      { courseId, studentId }: { courseId: number; studentId: number }
    ) => dal.courseStudents.delete(courseId, studentId),

    completeLesson: (_: any, { input }: { input: any }) =>
      dal.lessonStudents.create(input),
    uncompleteLesson: (
      _: any,
      {
        courseId,
        sequenceNumber,
        studentId,
      }: { courseId: number; sequenceNumber: number; studentId: number }
    ) => dal.lessonStudents.delete(courseId, sequenceNumber, studentId),
  },

  Teacher: {
    courses: (teacher: any) => dal.courses.findByTeacherId(teacher.id),
  },

  Course: {
    teacher: (course: any) => dal.teachers.findById(course.teacher_id),
    lessons: (course: any) => dal.lessons.findByCourseId(course.id),
    students: (course: any) =>
      dal.courseStudents.getStudentsForCourse(course.id),
  },

  Student: {
    courses: (student: any) =>
      dal.courseStudents.getCoursesForStudent(student.id),
    completedLessons: (student: any) =>
      dal.lessonStudents.getCompletedLessonsForStudent(student.id),
  },

  Lesson: {
    course: (lesson: any) => dal.courses.findById(lesson.course_id),
  },

  LessonCompletion: {
    lesson: (completion: any) =>
      dal.lessons.findById(completion.course_id, completion.sequence_number),
    student: (completion: any) => dal.students.findById(completion.student_id),
  },

  CourseEnrollment: {
    course: (enrollment: any) => dal.courses.findById(enrollment.course_id),
    student: (enrollment: any) => dal.students.findById(enrollment.student_id),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server);
console.log(`🚀 Server ready at ${url}`);
console.log("📊 Database initialized with SQLite backend");
