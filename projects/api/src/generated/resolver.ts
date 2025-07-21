import { GraphQLResolveInfo } from 'graphql';
import { DataAccessLayer } from '../dataAccessLayer';
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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

