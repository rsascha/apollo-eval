import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import {
  GET_ENROLLMENTS,
  GET_LESSONS_BY_COURSE,
  COMPLETE_LESSON,
  UNCOMPLETE_LESSON,
  GET_STUDENT_PROGRESS,
} from "@/queries";

interface Enrollment {
  course_id: number;
  student_id: number;
  course: {
    id: number;
    title: string;
    teacher: {
      name: string;
    };
  };
  student: {
    id: number;
    name: string;
    email?: string;
  };
}

interface Lesson {
  course_id: number;
  sequence_number: number;
  title: string;
  content?: string;
}

export function LessonProgressManagement() {
  const [selectedCourseId, setSelectedCourseId] = useState<number | "">("");
  const [selectedStudentId, setSelectedStudentId] = useState<number | "">("");

  const { data: enrollmentsData, loading: enrollmentsLoading } =
    useQuery(GET_ENROLLMENTS);

  const { data: lessonsData, loading: lessonsLoading } = useQuery(
    GET_LESSONS_BY_COURSE,
    {
      variables: { courseId: Number(selectedCourseId) },
      skip: !selectedCourseId,
    }
  );

  const { data: progressData, loading: progressLoading } = useQuery(
    GET_STUDENT_PROGRESS,
    {
      variables: {
        courseId: Number(selectedCourseId),
        studentId: Number(selectedStudentId),
      },
      skip: !selectedCourseId || !selectedStudentId,
    }
  );

  const [completeLesson] = useMutation(COMPLETE_LESSON, {
    refetchQueries: [
      {
        query: GET_STUDENT_PROGRESS,
        variables: {
          courseId: Number(selectedCourseId),
          studentId: Number(selectedStudentId),
        },
      },
    ],
  });

  const [uncompleteLesson] = useMutation(UNCOMPLETE_LESSON, {
    refetchQueries: [
      {
        query: GET_STUDENT_PROGRESS,
        variables: {
          courseId: Number(selectedCourseId),
          studentId: Number(selectedStudentId),
        },
      },
    ],
  });

  const handleCompleteLesson = async (
    courseId: number,
    sequenceNumber: number,
    studentId: number
  ) => {
    try {
      const input = {
        course_id: courseId,
        sequence_number: sequenceNumber,
        student_id: studentId,
        finished: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
      };

      await completeLesson({ variables: { input } });
    } catch (err) {
      console.error("Error completing lesson:", err);
    }
  };

  const handleUncompleteLesson = async (
    courseId: number,
    sequenceNumber: number,
    studentId: number
  ) => {
    try {
      await uncompleteLesson({
        variables: { courseId, sequenceNumber, studentId },
      });
    } catch (err) {
      console.error("Error uncompleting lesson:", err);
    }
  };

  // Get unique courses from enrollments
  const courses =
    enrollmentsData?.enrollments?.reduce(
      (
        acc: Array<{ id: number; title: string; teacher: { name: string } }>,
        enrollment: Enrollment
      ) => {
        const existingCourse = acc.find(
          (course) => course.id === enrollment.course_id
        );
        if (!existingCourse) {
          acc.push(enrollment.course);
        }
        return acc;
      },
      []
    ) || [];

  // Get students enrolled in the selected course
  const studentsInCourse =
    enrollmentsData?.enrollments
      ?.filter(
        (enrollment: Enrollment) =>
          enrollment.course_id === Number(selectedCourseId)
      )
      .map((enrollment: Enrollment) => enrollment.student) || [];

  // Check if a lesson is completed by the student
  const isLessonCompleted = (sequenceNumber: number) => {
    return progressData?.studentProgress?.some(
      (lesson: Lesson) => lesson.sequence_number === sequenceNumber
    );
  };

  if (enrollmentsLoading)
    return <div className="loading">Loading enrollments...</div>;

  return (
    <div className="lesson-progress-management">
      <h2>Lesson Progress Management</h2>

      <div className="selection-form">
        <div className="form-group">
          <label htmlFor="course">Select Course:</label>
          <select
            id="course"
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value ? Number(e.target.value) : "");
              setSelectedStudentId(""); // Reset student selection
            }}
          >
            <option value="">Select a course</option>
            {courses.map(
              (course: {
                id: number;
                title: string;
                teacher: { name: string };
              }) => (
                <option key={course.id} value={course.id}>
                  {course.title} (by {course.teacher.name})
                </option>
              )
            )}
          </select>
        </div>

        {selectedCourseId && (
          <div className="form-group">
            <label htmlFor="student">Select Student:</label>
            <select
              id="student"
              value={selectedStudentId}
              onChange={(e) =>
                setSelectedStudentId(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
            >
              <option value="">Select a student</option>
              {studentsInCourse.map(
                (student: { id: number; name: string; email?: string }) => (
                  <option key={student.id} value={student.id}>
                    {student.name} {student.email && `(${student.email})`}
                  </option>
                )
              )}
            </select>
          </div>
        )}
      </div>

      {selectedCourseId && selectedStudentId && (
        <div className="progress-section">
          <h3>
            Progress for{" "}
            {
              studentsInCourse.find(
                (s: { id: number; name: string }) =>
                  s.id === Number(selectedStudentId)
              )?.name
            }
            in{" "}
            {
              courses.find(
                (c: { id: number; title: string }) =>
                  c.id === Number(selectedCourseId)
              )?.title
            }
          </h3>

          {lessonsLoading || progressLoading ? (
            <div className="loading">Loading lessons and progress...</div>
          ) : (
            <div className="lessons-progress">
              {lessonsData?.lessonsByCourse?.map((lesson: Lesson) => {
                const completed = isLessonCompleted(lesson.sequence_number);

                return (
                  <div
                    key={lesson.sequence_number}
                    className={`lesson-progress-item ${
                      completed ? "completed" : "incomplete"
                    }`}
                  >
                    <div className="lesson-info">
                      <h4>
                        Lesson {lesson.sequence_number}: {lesson.title}
                        <span
                          className={`status ${
                            completed ? "completed" : "incomplete"
                          }`}
                        >
                          {completed ? "✓ Completed" : "○ Not Completed"}
                        </span>
                      </h4>
                      {lesson.content && (
                        <p className="content">
                          {lesson.content.length > 150
                            ? `${lesson.content.substring(0, 150)}...`
                            : lesson.content}
                        </p>
                      )}
                    </div>
                    <div className="lesson-actions">
                      {completed ? (
                        <button
                          onClick={() =>
                            handleUncompleteLesson(
                              lesson.course_id,
                              lesson.sequence_number,
                              Number(selectedStudentId)
                            )
                          }
                          className="uncomplete-btn"
                        >
                          Mark as Incomplete
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleCompleteLesson(
                              lesson.course_id,
                              lesson.sequence_number,
                              Number(selectedStudentId)
                            )
                          }
                          className="complete-btn"
                        >
                          Mark as Complete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {(!lessonsData?.lessonsByCourse ||
                lessonsData.lessonsByCourse.length === 0) && (
                <p className="no-lessons">No lessons found for this course.</p>
              )}

              {lessonsData?.lessonsByCourse && (
                <div className="progress-summary">
                  <p>
                    <strong>Progress:</strong>{" "}
                    {progressData?.studentProgress?.length || 0} of{" "}
                    {lessonsData.lessonsByCourse.length} lessons completed (
                    {Math.round(
                      ((progressData?.studentProgress?.length || 0) /
                        lessonsData.lessonsByCourse.length) *
                        100
                    )}
                    %)
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!selectedCourseId && (
        <p className="instruction">
          Please select a course to view enrolled students and manage lesson
          progress.
        </p>
      )}

      {selectedCourseId && !selectedStudentId && (
        <p className="instruction">
          Please select a student to view and manage their lesson progress.
        </p>
      )}
    </div>
  );
}
