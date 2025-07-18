import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import {
  GET_COURSES,
  GET_TEACHERS,
  CREATE_COURSE,
  UPDATE_COURSE,
  DELETE_COURSE,
} from "@/queries";

interface Course {
  id: number;
  title: string;
  description?: string;
  duration_hours?: number;
  teacher_id: number;
  teacher: {
    id: number;
    name: string;
    area?: string;
  };
  lessons?: Array<{
    course_id: number;
    sequence_number: number;
    title: string;
    content?: string;
  }>;
  students?: Array<{
    id: number;
    name: string;
    email?: string;
  }>;
}

export function CourseManagement() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationHours, setDurationHours] = useState<number | "">("");
  const [teacherId, setTeacherId] = useState<number | "">("");
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const {
    data: coursesData,
    loading: coursesLoading,
    error: coursesError,
  } = useQuery(GET_COURSES);
  const { data: teachersData } = useQuery(GET_TEACHERS);

  const [createCourse, { loading: createLoading }] = useMutation(
    CREATE_COURSE,
    {
      refetchQueries: [{ query: GET_COURSES }],
    }
  );
  const [updateCourse, { loading: updateLoading }] = useMutation(
    UPDATE_COURSE,
    {
      refetchQueries: [{ query: GET_COURSES }],
    }
  );
  const [deleteCourse] = useMutation(DELETE_COURSE, {
    refetchQueries: [{ query: GET_COURSES }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !teacherId) {
      return;
    }

    try {
      const input = {
        title: title.trim(),
        description: description.trim() || undefined,
        duration_hours: durationHours || undefined,
        teacher_id: Number(teacherId),
      };

      if (editingCourse) {
        await updateCourse({
          variables: {
            id: editingCourse.id,
            input,
          },
        });
      } else {
        await createCourse({
          variables: { input },
        });
      }

      setTitle("");
      setDescription("");
      setDurationHours("");
      setTeacherId("");
      setEditingCourse(null);
    } catch (err) {
      console.error("Error saving course:", err);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setDescription(course.description || "");
    setDurationHours(course.duration_hours || "");
    setTeacherId(course.teacher_id);
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    setTitle("");
    setDescription("");
    setDurationHours("");
    setTeacherId("");
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse({ variables: { id } });
      } catch (err) {
        console.error("Error deleting course:", err);
      }
    }
  };

  if (coursesLoading) return <div className="loading">Loading courses...</div>;
  if (coursesError)
    return <div className="error">Error: {coursesError.message}</div>;

  return (
    <div className="course-management">
      <h2>Course Management</h2>

      <form onSubmit={handleSubmit} className="course-form">
        <h3>{editingCourse ? "Edit Course" : "Add New Course"}</h3>

        <div className="form-group">
          <label htmlFor="title">Title (required):</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={createLoading || updateLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={createLoading || updateLoading}
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration (hours):</label>
          <input
            type="number"
            id="duration"
            value={durationHours}
            onChange={(e) =>
              setDurationHours(e.target.value ? Number(e.target.value) : "")
            }
            min="1"
            disabled={createLoading || updateLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="teacher">Teacher (required):</label>
          <select
            id="teacher"
            value={teacherId}
            onChange={(e) =>
              setTeacherId(e.target.value ? Number(e.target.value) : "")
            }
            required
            disabled={createLoading || updateLoading}
          >
            <option value="">Select a teacher</option>
            {teachersData?.teachers?.map(
              (teacher: { id: number; name: string; area?: string }) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} {teacher.area && `(${teacher.area})`}
                </option>
              )
            )}
          </select>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={
              createLoading || updateLoading || !title.trim() || !teacherId
            }
          >
            {createLoading || updateLoading
              ? "Saving..."
              : editingCourse
              ? "Update Course"
              : "Create Course"}
          </button>
          {editingCourse && (
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

      <div className="courses-list">
        <h3>Courses ({coursesData?.courses?.length || 0})</h3>
        {coursesData?.courses?.map((course: Course) => (
          <div key={course.id} className="course-card">
            <div className="course-info">
              <h4>{course.title}</h4>
              {course.description && (
                <p className="description">{course.description}</p>
              )}
              <div className="course-details">
                <p>
                  <strong>Teacher:</strong> {course.teacher.name}
                </p>
                {course.duration_hours && (
                  <p>
                    <strong>Duration:</strong> {course.duration_hours} hours
                  </p>
                )}
                <p>
                  <strong>Lessons:</strong> {course.lessons?.length || 0}
                </p>
                <p>
                  <strong>Students Enrolled:</strong>{" "}
                  {course.students?.length || 0}
                </p>
              </div>
              {course.students && course.students.length > 0 && (
                <div className="enrolled-students">
                  <strong>Enrolled Students:</strong>
                  <ul>
                    {course.students.map((student) => (
                      <li key={student.id}>{student.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="course-actions">
              <button onClick={() => handleEdit(course)} className="edit-btn">
                Edit
              </button>
              <button
                onClick={() => handleDelete(course.id)}
                className="delete-btn"
                disabled={
                  (course.lessons && course.lessons.length > 0) ||
                  (course.students && course.students.length > 0)
                }
                title={
                  (course.lessons && course.lessons.length > 0) ||
                  (course.students && course.students.length > 0)
                    ? "Cannot delete course with lessons or enrolled students"
                    : "Delete course"
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
