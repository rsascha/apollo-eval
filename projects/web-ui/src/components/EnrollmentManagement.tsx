import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import {
  GET_ENROLLMENTS,
  GET_COURSES,
  GET_STUDENTS,
  ENROLL_STUDENT,
  UNENROLL_STUDENT,
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

export function EnrollmentManagement() {
  const [courseId, setCourseId] = useState<number | "">("");
  const [studentId, setStudentId] = useState<number | "">("");

  const {
    data: enrollmentsData,
    loading: enrollmentsLoading,
    error: enrollmentsError,
  } = useQuery(GET_ENROLLMENTS);
  const { data: coursesData } = useQuery(GET_COURSES);
  const { data: studentsData } = useQuery(GET_STUDENTS);

  const [enrollStudent, { loading: enrollLoading }] = useMutation(
    ENROLL_STUDENT,
    {
      refetchQueries: [
        { query: GET_ENROLLMENTS },
        { query: GET_STUDENTS },
        { query: GET_COURSES },
      ],
    }
  );
  const [unenrollStudent] = useMutation(UNENROLL_STUDENT, {
    refetchQueries: [
      { query: GET_ENROLLMENTS },
      { query: GET_STUDENTS },
      { query: GET_COURSES },
    ],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseId || !studentId) {
      return;
    }

    try {
      const input = {
        course_id: Number(courseId),
        student_id: Number(studentId),
      };

      await enrollStudent({
        variables: { input },
      });

      setCourseId("");
      setStudentId("");
    } catch (err) {
      console.error("Error enrolling student:", err);
    }
  };

  const handleUnenroll = async (courseId: number, studentId: number) => {
    if (window.confirm("Are you sure you want to unenroll this student?")) {
      try {
        await unenrollStudent({ variables: { courseId, studentId } });
      } catch (err) {
        console.error("Error unenrolling student:", err);
      }
    }
  };

  // Filter available students (not already enrolled in the selected course)
  const getAvailableStudents = () => {
    if (!courseId || !studentsData?.students || !enrollmentsData?.enrollments) {
      return studentsData?.students || [];
    }

    const enrolledStudentIds = enrollmentsData.enrollments
      .filter(
        (enrollment: Enrollment) => enrollment.course_id === Number(courseId)
      )
      .map((enrollment: Enrollment) => enrollment.student_id);

    return studentsData.students.filter(
      (student: { id: number }) => !enrolledStudentIds.includes(student.id)
    );
  };

  if (enrollmentsLoading)
    return <div className="loading">Loading enrollments...</div>;
  if (enrollmentsError)
    return <div className="error">Error: {enrollmentsError.message}</div>;

  return (
    <div className="enrollment-management">
      <h2>Enrollment Management</h2>

      <form onSubmit={handleSubmit} className="enrollment-form">
        <h3>Enroll Student in Course</h3>

        <div className="form-group">
          <label htmlFor="course">Course (required):</label>
          <select
            id="course"
            value={courseId}
            onChange={(e) =>
              setCourseId(e.target.value ? Number(e.target.value) : "")
            }
            required
            disabled={enrollLoading}
          >
            <option value="">Select a course</option>
            {coursesData?.courses?.map(
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

        <div className="form-group">
          <label htmlFor="student">Student (required):</label>
          <select
            id="student"
            value={studentId}
            onChange={(e) =>
              setStudentId(e.target.value ? Number(e.target.value) : "")
            }
            required
            disabled={enrollLoading || !courseId}
          >
            <option value="">Select a student</option>
            {getAvailableStudents().map(
              (student: { id: number; name: string; email?: string }) => (
                <option key={student.id} value={student.id}>
                  {student.name} {student.email && `(${student.email})`}
                </option>
              )
            )}
          </select>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={enrollLoading || !courseId || !studentId}
          >
            {enrollLoading ? "Enrolling..." : "Enroll Student"}
          </button>
        </div>
      </form>

      <div className="enrollments-list">
        <h3>
          Current Enrollments ({enrollmentsData?.enrollments?.length || 0})
        </h3>

        {/* Group enrollments by course */}
        {coursesData?.courses?.map(
          (course: {
            id: number;
            title: string;
            teacher: { name: string };
          }) => {
            const courseEnrollments =
              enrollmentsData?.enrollments?.filter(
                (enrollment: Enrollment) => enrollment.course_id === course.id
              ) || [];

            if (courseEnrollments.length === 0) return null;

            return (
              <div key={course.id} className="course-enrollments">
                <h4 className="course-title">
                  {course.title}{" "}
                  <span className="teacher">(by {course.teacher.name})</span>
                  <span className="count">
                    {" "}
                    - {courseEnrollments.length} student(s)
                  </span>
                </h4>
                <div className="enrolled-students">
                  {courseEnrollments.map((enrollment: Enrollment) => (
                    <div
                      key={`${enrollment.course_id}-${enrollment.student_id}`}
                      className="enrollment-item"
                    >
                      <div className="student-info">
                        <strong>{enrollment.student.name}</strong>
                        {enrollment.student.email && (
                          <span className="email">
                            {" "}
                            ({enrollment.student.email})
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          handleUnenroll(
                            enrollment.course_id,
                            enrollment.student_id
                          )
                        }
                        className="unenroll-btn"
                      >
                        Unenroll
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
        )}

        {(!enrollmentsData?.enrollments ||
          enrollmentsData.enrollments.length === 0) && (
          <p className="no-enrollments">
            No students are currently enrolled in any courses.
          </p>
        )}
      </div>
    </div>
  );
}
