import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import {
  GET_LESSONS,
  GET_COURSES,
  CREATE_LESSON,
  UPDATE_LESSON,
  DELETE_LESSON,
} from "@/queries";

interface Lesson {
  course_id: number;
  sequence_number: number;
  title: string;
  content?: string;
  course: {
    id: number;
    title: string;
    teacher: {
      name: string;
    };
  };
}

export function LessonManagement() {
  const [courseId, setCourseId] = useState<number | "">("");
  const [sequenceNumber, setSequenceNumber] = useState<number | "">("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const {
    data: lessonsData,
    loading: lessonsLoading,
    error: lessonsError,
  } = useQuery(GET_LESSONS);
  const { data: coursesData } = useQuery(GET_COURSES);

  const [createLesson, { loading: createLoading }] = useMutation(
    CREATE_LESSON,
    {
      refetchQueries: [{ query: GET_LESSONS }],
    }
  );
  const [updateLesson, { loading: updateLoading }] = useMutation(
    UPDATE_LESSON,
    {
      refetchQueries: [{ query: GET_LESSONS }],
    }
  );
  const [deleteLesson] = useMutation(DELETE_LESSON, {
    refetchQueries: [{ query: GET_LESSONS }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseId || !sequenceNumber || !title.trim()) {
      return;
    }

    try {
      if (editingLesson) {
        await updateLesson({
          variables: {
            courseId: editingLesson.course_id,
            sequenceNumber: editingLesson.sequence_number,
            title: title.trim() || undefined,
            content: content.trim() || undefined,
          },
        });
      } else {
        const input = {
          course_id: Number(courseId),
          sequence_number: Number(sequenceNumber),
          title: title.trim(),
          content: content.trim() || undefined,
        };

        await createLesson({
          variables: { input },
        });
      }

      setCourseId("");
      setSequenceNumber("");
      setTitle("");
      setContent("");
      setEditingLesson(null);
    } catch (err) {
      console.error("Error saving lesson:", err);
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setCourseId(lesson.course_id);
    setSequenceNumber(lesson.sequence_number);
    setTitle(lesson.title);
    setContent(lesson.content || "");
  };

  const handleCancelEdit = () => {
    setEditingLesson(null);
    setCourseId("");
    setSequenceNumber("");
    setTitle("");
    setContent("");
  };

  const handleDelete = async (courseId: number, sequenceNumber: number) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      try {
        await deleteLesson({ variables: { courseId, sequenceNumber } });
      } catch (err) {
        console.error("Error deleting lesson:", err);
      }
    }
  };

  if (lessonsLoading) return <div className="loading">Loading lessons...</div>;
  if (lessonsError)
    return <div className="error">Error: {lessonsError.message}</div>;

  return (
    <div className="lesson-management">
      <h2>Lesson Management</h2>

      <form onSubmit={handleSubmit} className="lesson-form">
        <h3>{editingLesson ? "Edit Lesson" : "Add New Lesson"}</h3>

        <div className="form-group">
          <label htmlFor="course">Course (required):</label>
          <select
            id="course"
            value={courseId}
            onChange={(e) =>
              setCourseId(e.target.value ? Number(e.target.value) : "")
            }
            required
            disabled={createLoading || updateLoading || !!editingLesson}
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
          <label htmlFor="sequence">Sequence Number (required):</label>
          <input
            type="number"
            id="sequence"
            value={sequenceNumber}
            onChange={(e) =>
              setSequenceNumber(e.target.value ? Number(e.target.value) : "")
            }
            min="1"
            required
            disabled={createLoading || updateLoading || !!editingLesson}
          />
        </div>

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
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={createLoading || updateLoading}
            rows={6}
            placeholder="Enter lesson content..."
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={
              createLoading ||
              updateLoading ||
              !courseId ||
              !sequenceNumber ||
              !title.trim()
            }
          >
            {createLoading || updateLoading
              ? "Saving..."
              : editingLesson
              ? "Update Lesson"
              : "Create Lesson"}
          </button>
          {editingLesson && (
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

      <div className="lessons-list">
        <h3>Lessons ({lessonsData?.lessons?.length || 0})</h3>
        {lessonsData?.lessons?.map((lesson: Lesson) => (
          <div
            key={`${lesson.course_id}-${lesson.sequence_number}`}
            className="lesson-card"
          >
            <div className="lesson-info">
              <h4>
                {lesson.title}
                <span className="sequence">
                  {" "}
                  (Lesson #{lesson.sequence_number})
                </span>
              </h4>
              <p className="course-info">
                <strong>Course:</strong> {lesson.course.title}
                <span className="teacher">
                  {" "}
                  (by {lesson.course.teacher.name})
                </span>
              </p>
              {lesson.content && (
                <div className="content">
                  <strong>Content:</strong>
                  <p>
                    {lesson.content.length > 200
                      ? `${lesson.content.substring(0, 200)}...`
                      : lesson.content}
                  </p>
                </div>
              )}
            </div>
            <div className="lesson-actions">
              <button onClick={() => handleEdit(lesson)} className="edit-btn">
                Edit
              </button>
              <button
                onClick={() =>
                  handleDelete(lesson.course_id, lesson.sequence_number)
                }
                className="delete-btn"
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
