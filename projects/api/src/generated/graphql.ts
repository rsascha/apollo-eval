import { GraphQLResolveInfo } from 'graphql';
import { DataAccessLayer } from '../dataAccessLayer';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CompleteLessonInput: CompleteLessonInput;
  Course: ResolverTypeWrapper<Course>;
  CourseEnrollment: ResolverTypeWrapper<CourseEnrollment>;
  CreateCourseInput: CreateCourseInput;
  CreateLessonInput: CreateLessonInput;
  CreateStudentInput: CreateStudentInput;
  CreateTeacherInput: CreateTeacherInput;
  EnrollStudentInput: EnrollStudentInput;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Lesson: ResolverTypeWrapper<Lesson>;
  LessonCompletion: ResolverTypeWrapper<LessonCompletion>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Student: ResolverTypeWrapper<Student>;
  Teacher: ResolverTypeWrapper<Teacher>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  CompleteLessonInput: CompleteLessonInput;
  Course: Course;
  CourseEnrollment: CourseEnrollment;
  CreateCourseInput: CreateCourseInput;
  CreateLessonInput: CreateLessonInput;
  CreateStudentInput: CreateStudentInput;
  CreateTeacherInput: CreateTeacherInput;
  EnrollStudentInput: EnrollStudentInput;
  Int: Scalars['Int']['output'];
  Lesson: Lesson;
  LessonCompletion: LessonCompletion;
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  Student: Student;
  Teacher: Teacher;
}>;

export type CourseResolvers<ContextType = DataAccessLayer, ParentType extends ResolversParentTypes['Course'] = ResolversParentTypes['Course']> = ResolversObject<{
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  duration_hours?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lessons?: Resolver<Array<ResolversTypes['Lesson']>, ParentType, ContextType>;
  students?: Resolver<Array<ResolversTypes['Student']>, ParentType, ContextType>;
  teacher?: Resolver<ResolversTypes['Teacher'], ParentType, ContextType>;
  teacher_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CourseEnrollmentResolvers<ContextType = DataAccessLayer, ParentType extends ResolversParentTypes['CourseEnrollment'] = ResolversParentTypes['CourseEnrollment']> = ResolversObject<{
  course?: Resolver<ResolversTypes['Course'], ParentType, ContextType>;
  course_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  student?: Resolver<ResolversTypes['Student'], ParentType, ContextType>;
  student_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LessonResolvers<ContextType = DataAccessLayer, ParentType extends ResolversParentTypes['Lesson'] = ResolversParentTypes['Lesson']> = ResolversObject<{
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  course?: Resolver<ResolversTypes['Course'], ParentType, ContextType>;
  course_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  sequence_number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LessonCompletionResolvers<ContextType = DataAccessLayer, ParentType extends ResolversParentTypes['LessonCompletion'] = ResolversParentTypes['LessonCompletion']> = ResolversObject<{
  course_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  finished?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lesson?: Resolver<ResolversTypes['Lesson'], ParentType, ContextType>;
  sequence_number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  student?: Resolver<ResolversTypes['Student'], ParentType, ContextType>;
  student_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = DataAccessLayer, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  completeLesson?: Resolver<ResolversTypes['LessonCompletion'], ParentType, ContextType, RequireFields<MutationCompleteLessonArgs, 'input'>>;
  createCourse?: Resolver<ResolversTypes['Course'], ParentType, ContextType, RequireFields<MutationCreateCourseArgs, 'input'>>;
  createLesson?: Resolver<ResolversTypes['Lesson'], ParentType, ContextType, RequireFields<MutationCreateLessonArgs, 'input'>>;
  createStudent?: Resolver<ResolversTypes['Student'], ParentType, ContextType, RequireFields<MutationCreateStudentArgs, 'input'>>;
  createTeacher?: Resolver<ResolversTypes['Teacher'], ParentType, ContextType, RequireFields<MutationCreateTeacherArgs, 'input'>>;
  deleteCourse?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCourseArgs, 'id'>>;
  deleteLesson?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteLessonArgs, 'courseId' | 'sequenceNumber'>>;
  deleteStudent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteStudentArgs, 'id'>>;
  deleteTeacher?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTeacherArgs, 'id'>>;
  enrollStudent?: Resolver<ResolversTypes['CourseEnrollment'], ParentType, ContextType, RequireFields<MutationEnrollStudentArgs, 'input'>>;
  uncompleteLesson?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUncompleteLessonArgs, 'courseId' | 'sequenceNumber' | 'studentId'>>;
  unenrollStudent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUnenrollStudentArgs, 'courseId' | 'studentId'>>;
  updateCourse?: Resolver<Maybe<ResolversTypes['Course']>, ParentType, ContextType, RequireFields<MutationUpdateCourseArgs, 'id' | 'input'>>;
  updateLesson?: Resolver<Maybe<ResolversTypes['Lesson']>, ParentType, ContextType, RequireFields<MutationUpdateLessonArgs, 'courseId' | 'sequenceNumber'>>;
  updateStudent?: Resolver<Maybe<ResolversTypes['Student']>, ParentType, ContextType, RequireFields<MutationUpdateStudentArgs, 'id' | 'input'>>;
  updateTeacher?: Resolver<Maybe<ResolversTypes['Teacher']>, ParentType, ContextType, RequireFields<MutationUpdateTeacherArgs, 'id' | 'input'>>;
}>;

export type QueryResolvers<ContextType = DataAccessLayer, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  completions?: Resolver<Array<ResolversTypes['LessonCompletion']>, ParentType, ContextType>;
  course?: Resolver<Maybe<ResolversTypes['Course']>, ParentType, ContextType, RequireFields<QueryCourseArgs, 'id'>>;
  courses?: Resolver<Array<ResolversTypes['Course']>, ParentType, ContextType>;
  enrollments?: Resolver<Array<ResolversTypes['CourseEnrollment']>, ParentType, ContextType>;
  lessons?: Resolver<Array<ResolversTypes['Lesson']>, ParentType, ContextType>;
  lessonsByCourse?: Resolver<Array<ResolversTypes['Lesson']>, ParentType, ContextType, RequireFields<QueryLessonsByCourseArgs, 'courseId'>>;
  student?: Resolver<Maybe<ResolversTypes['Student']>, ParentType, ContextType, RequireFields<QueryStudentArgs, 'id'>>;
  studentProgress?: Resolver<Array<ResolversTypes['Lesson']>, ParentType, ContextType, RequireFields<QueryStudentProgressArgs, 'courseId' | 'studentId'>>;
  students?: Resolver<Array<ResolversTypes['Student']>, ParentType, ContextType>;
  teacher?: Resolver<Maybe<ResolversTypes['Teacher']>, ParentType, ContextType, RequireFields<QueryTeacherArgs, 'id'>>;
  teachers?: Resolver<Array<ResolversTypes['Teacher']>, ParentType, ContextType>;
}>;

export type StudentResolvers<ContextType = DataAccessLayer, ParentType extends ResolversParentTypes['Student'] = ResolversParentTypes['Student']> = ResolversObject<{
  completedLessons?: Resolver<Array<ResolversTypes['LessonCompletion']>, ParentType, ContextType>;
  courses?: Resolver<Array<ResolversTypes['Course']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TeacherResolvers<ContextType = DataAccessLayer, ParentType extends ResolversParentTypes['Teacher'] = ResolversParentTypes['Teacher']> = ResolversObject<{
  area?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  courses?: Resolver<Array<ResolversTypes['Course']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = DataAccessLayer> = ResolversObject<{
  Course?: CourseResolvers<ContextType>;
  CourseEnrollment?: CourseEnrollmentResolvers<ContextType>;
  Lesson?: LessonResolvers<ContextType>;
  LessonCompletion?: LessonCompletionResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Student?: StudentResolvers<ContextType>;
  Teacher?: TeacherResolvers<ContextType>;
}>;

