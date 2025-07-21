export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CompleteLessonInput = {
  course_id: Scalars['Int']['input'];
  finished: Scalars['String']['input'];
  sequence_number: Scalars['Int']['input'];
  student_id: Scalars['Int']['input'];
};

export type Course = {
  __typename?: 'Course';
  description?: Maybe<Scalars['String']['output']>;
  duration_hours?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  lessons: Array<Lesson>;
  students: Array<Student>;
  teacher: Teacher;
  teacher_id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type CourseEnrollment = {
  __typename?: 'CourseEnrollment';
  course: Course;
  course_id: Scalars['Int']['output'];
  student: Student;
  student_id: Scalars['Int']['output'];
};

export type CreateCourseInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  duration_hours?: InputMaybe<Scalars['Int']['input']>;
  teacher_id: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type CreateLessonInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  course_id: Scalars['Int']['input'];
  sequence_number: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type CreateStudentInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateTeacherInput = {
  area?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type EnrollStudentInput = {
  course_id: Scalars['Int']['input'];
  student_id: Scalars['Int']['input'];
};

export type Lesson = {
  __typename?: 'Lesson';
  content?: Maybe<Scalars['String']['output']>;
  course: Course;
  course_id: Scalars['Int']['output'];
  sequence_number: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type LessonCompletion = {
  __typename?: 'LessonCompletion';
  course_id: Scalars['Int']['output'];
  finished: Scalars['String']['output'];
  lesson: Lesson;
  sequence_number: Scalars['Int']['output'];
  student: Student;
  student_id: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  completeLesson: LessonCompletion;
  createCourse: Course;
  createLesson: Lesson;
  createStudent: Student;
  createTeacher: Teacher;
  deleteCourse: Scalars['Boolean']['output'];
  deleteLesson: Scalars['Boolean']['output'];
  deleteStudent: Scalars['Boolean']['output'];
  deleteTeacher: Scalars['Boolean']['output'];
  enrollStudent: CourseEnrollment;
  uncompleteLesson: Scalars['Boolean']['output'];
  unenrollStudent: Scalars['Boolean']['output'];
  updateCourse?: Maybe<Course>;
  updateLesson?: Maybe<Lesson>;
  updateStudent?: Maybe<Student>;
  updateTeacher?: Maybe<Teacher>;
};


export type MutationCompleteLessonArgs = {
  input: CompleteLessonInput;
};


export type MutationCreateCourseArgs = {
  input: CreateCourseInput;
};


export type MutationCreateLessonArgs = {
  input: CreateLessonInput;
};


export type MutationCreateStudentArgs = {
  input: CreateStudentInput;
};


export type MutationCreateTeacherArgs = {
  input: CreateTeacherInput;
};


export type MutationDeleteCourseArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteLessonArgs = {
  courseId: Scalars['Int']['input'];
  sequenceNumber: Scalars['Int']['input'];
};


export type MutationDeleteStudentArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteTeacherArgs = {
  id: Scalars['Int']['input'];
};


export type MutationEnrollStudentArgs = {
  input: EnrollStudentInput;
};


export type MutationUncompleteLessonArgs = {
  courseId: Scalars['Int']['input'];
  sequenceNumber: Scalars['Int']['input'];
  studentId: Scalars['Int']['input'];
};


export type MutationUnenrollStudentArgs = {
  courseId: Scalars['Int']['input'];
  studentId: Scalars['Int']['input'];
};


export type MutationUpdateCourseArgs = {
  id: Scalars['Int']['input'];
  input: CreateCourseInput;
};


export type MutationUpdateLessonArgs = {
  content?: InputMaybe<Scalars['String']['input']>;
  courseId: Scalars['Int']['input'];
  sequenceNumber: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateStudentArgs = {
  id: Scalars['Int']['input'];
  input: CreateStudentInput;
};


export type MutationUpdateTeacherArgs = {
  id: Scalars['Int']['input'];
  input: CreateTeacherInput;
};

export type Query = {
  __typename?: 'Query';
  completions: Array<LessonCompletion>;
  course?: Maybe<Course>;
  courses: Array<Course>;
  enrollments: Array<CourseEnrollment>;
  lessons: Array<Lesson>;
  lessonsByCourse: Array<Lesson>;
  student?: Maybe<Student>;
  studentProgress: Array<Lesson>;
  students: Array<Student>;
  teacher?: Maybe<Teacher>;
  teachers: Array<Teacher>;
};


export type QueryCourseArgs = {
  id: Scalars['Int']['input'];
};


export type QueryLessonsByCourseArgs = {
  courseId: Scalars['Int']['input'];
};


export type QueryStudentArgs = {
  id: Scalars['Int']['input'];
};


export type QueryStudentProgressArgs = {
  courseId: Scalars['Int']['input'];
  studentId: Scalars['Int']['input'];
};


export type QueryTeacherArgs = {
  id: Scalars['Int']['input'];
};

export type Student = {
  __typename?: 'Student';
  completedLessons: Array<LessonCompletion>;
  courses: Array<Course>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type Teacher = {
  __typename?: 'Teacher';
  area?: Maybe<Scalars['String']['output']>;
  courses: Array<Course>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};
