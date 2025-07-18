import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import {
  GET_TEACHERS,
  CREATE_TEACHER,
  UPDATE_TEACHER,
  DELETE_TEACHER,
} from "@/queries";

interface Teacher {
  id: number;
  name: string;
  area?: string;
  courses?: Array<{
    id: number;
    title: string;
    description?: string;
    duration_hours?: number;
  }>;
}

export function TeacherManagement() {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const { data, loading, error } = useQuery(GET_TEACHERS);
  const [createTeacher, { loading: createLoading }] = useMutation(
    CREATE_TEACHER,
    {
      refetchQueries: [{ query: GET_TEACHERS }],
    }
  );
  const [updateTeacher, { loading: updateLoading }] = useMutation(
    UPDATE_TEACHER,
    {
      refetchQueries: [{ query: GET_TEACHERS }],
    }
  );
  const [deleteTeacher] = useMutation(DELETE_TEACHER, {
    refetchQueries: [{ query: GET_TEACHERS }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    try {
      const input = {
        name: name.trim(),
        area: area.trim() || undefined,
      };

      if (editingTeacher) {
        await updateTeacher({
          variables: {
            id: editingTeacher.id,
            input,
          },
        });
      } else {
        await createTeacher({
          variables: { input },
        });
      }

      setName("");
      setArea("");
      setEditingTeacher(null);
    } catch (err) {
      console.error("Error saving teacher:", err);
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setName(teacher.name);
    setArea(teacher.area || "");
  };

  const handleCancelEdit = () => {
    setEditingTeacher(null);
    setName("");
    setArea("");
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await deleteTeacher({ variables: { id } });
      } catch (err) {
        console.error("Error deleting teacher:", err);
      }
    }
  };

  if (loading) return <div className="loading">Loading teachers...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="teacher-management">
      <h2>Teacher Management</h2>

      <form onSubmit={handleSubmit} className="teacher-form">
        <h3>{editingTeacher ? "Edit Teacher" : "Add New Teacher"}</h3>

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
          <label htmlFor="area">Area/Subject:</label>
          <input
            type="text"
            id="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
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
              : editingTeacher
              ? "Update Teacher"
              : "Create Teacher"}
          </button>
          {editingTeacher && (
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

      <div className="teachers-list">
        <h3>Teachers ({data?.teachers?.length || 0})</h3>
        {data?.teachers?.map((teacher: Teacher) => (
          <div key={teacher.id} className="teacher-card">
            <div className="teacher-info">
              <h4>{teacher.name}</h4>
              {teacher.area && <p className="area">Area: {teacher.area}</p>}
              <p className="courses-count">
                Courses: {teacher.courses?.length || 0}
              </p>
              {teacher.courses && teacher.courses.length > 0 && (
                <div className="courses">
                  <strong>Teaching:</strong>
                  <ul>
                    {teacher.courses.map((course) => (
                      <li key={course.id}>
                        {course.title}{" "}
                        {course.duration_hours && `(${course.duration_hours}h)`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="teacher-actions">
              <button onClick={() => handleEdit(teacher)} className="edit-btn">
                Edit
              </button>
              <button
                onClick={() => handleDelete(teacher.id)}
                className="delete-btn"
                disabled={teacher.courses && teacher.courses.length > 0}
                title={
                  teacher.courses && teacher.courses.length > 0
                    ? "Cannot delete teacher with courses"
                    : "Delete teacher"
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
