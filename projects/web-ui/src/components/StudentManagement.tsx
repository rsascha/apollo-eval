import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import {
  GET_STUDENTS,
  CREATE_STUDENT,
  UPDATE_STUDENT,
  DELETE_STUDENT,
} from "@/queries";

interface Student {
  id: number;
  name: string;
  email?: string;
  courses?: Array<{
    id: number;
    title: string;
    teacher: {
      name: string;
    };
  }>;
  completedLessons?: Array<{
    course_id: number;
    sequence_number: number;
    student_id: number;
    finished: string;
    lesson: {
      course_id: number;
      sequence_number: number;
      title: string;
    };
  }>;
}

export function StudentManagement() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const { data, loading, error } = useQuery(GET_STUDENTS);
  const [createStudent, { loading: createLoading }] = useMutation(
    CREATE_STUDENT,
    {
      refetchQueries: [{ query: GET_STUDENTS }],
    }
  );
  const [updateStudent, { loading: updateLoading }] = useMutation(
    UPDATE_STUDENT,
    {
      refetchQueries: [{ query: GET_STUDENTS }],
    }
  );
  const [deleteStudent] = useMutation(DELETE_STUDENT, {
    refetchQueries: [{ query: GET_STUDENTS }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    try {
      const input = {
        name: name.trim(),
        email: email.trim() || undefined,
      };

      if (editingStudent) {
        await updateStudent({
          variables: {
            id: editingStudent.id,
            input,
          },
        });
      } else {
        await createStudent({
          variables: { input },
        });
      }

      setName("");
      setEmail("");
      setEditingStudent(null);
    } catch (err) {
      console.error("Error saving student:", err);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setName(student.name);
    setEmail(student.email || "");
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    setName("");
    setEmail("");
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent({ variables: { id } });
      } catch (err) {
        console.error("Error deleting student:", err);
      }
    }
  };

  if (loading) return <div className="loading">Loading students...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="student-management">
      <h2>Student Management</h2>

      <form onSubmit={handleSubmit} className="student-form">
        <h3>{editingStudent ? "Edit Student" : "Add New Student"}</h3>

        <div className="form-group">
          <label htmlFor="name">Name (required):</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={createLoading || updateLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={createLoading || updateLoading}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={createLoading || updateLoading || !name.trim()}
          >
            {createLoading || updateLoading
              ? "Saving..."
              : editingStudent
              ? "Update Student"
              : "Create Student"}
          </button>
          {editingStudent && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="students-list">
        <h3>Students ({data?.students?.length || 0})</h3>
        {data?.students?.map((student: Student) => (
          <div key={student.id} className="student-card">
            <div className="student-info">
              <h4>{student.name}</h4>
              {student.email && <p className="email">Email: {student.email}</p>}
              <p className="courses-count">
                Enrolled in: {student.courses?.length || 0} course(s)
              </p>
              <p className="lessons-count">
                Completed: {student.completedLessons?.length || 0} lesson(s)
              </p>

              {student.courses && student.courses.length > 0 && (
                <div className="enrolled-courses">
                  <strong>Enrolled Courses:</strong>
                  <ul>
                    {student.courses.map((course) => (
                      <li key={course.id}>
                        {course.title}{" "}
                        <span className="teacher">({course.teacher.name})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {student.completedLessons &&
                student.completedLessons.length > 0 && (
                  <div className="completed-lessons">
                    <strong>Recent Completions:</strong>
                    <ul>
                      {student.completedLessons
                        .slice(0, 3)
                        .map((completion) => (
                          <li
                            key={`${completion.course_id}-${completion.sequence_number}`}
                          >
                            {completion.lesson.title}{" "}
                            <span className="date">
                              ({completion.finished})
                            </span>
                          </li>
                        ))}
                      {student.completedLessons.length > 3 && (
                        <li className="more">
                          ...and {student.completedLessons.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>
                )}
            </div>
            <div className="student-actions">
              <button onClick={() => handleEdit(student)} className="edit-btn">
                Edit
              </button>
              <button
                onClick={() => handleDelete(student.id)}
                className="delete-btn"
                disabled={student.courses && student.courses.length > 0}
                title={
                  student.courses && student.courses.length > 0
                    ? "Cannot delete student enrolled in courses"
                    : "Delete student"
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
