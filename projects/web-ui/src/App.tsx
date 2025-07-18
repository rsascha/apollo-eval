import { useState } from "react";
import {
  TeacherManagement,
  CourseManagement,
  StudentManagement,
  LessonManagement,
  EnrollmentManagement,
  LessonProgressManagement,
} from "@/components";
import "./App.css";

type TabType =
  | "teachers"
  | "courses"
  | "students"
  | "lessons"
  | "enrollments"
  | "progress";

function App() {
  const [activeTab, setActiveTab] = useState<TabType>("teachers");

  const tabs = [
    { id: "teachers" as const, label: "Teachers", icon: "👨‍🏫" },
    { id: "courses" as const, label: "Courses", icon: "📚" },
    { id: "students" as const, label: "Students", icon: "👨‍🎓" },
    { id: "lessons" as const, label: "Lessons", icon: "📝" },
    { id: "enrollments" as const, label: "Enrollments", icon: "📋" },
    { id: "progress" as const, label: "Progress", icon: "📊" },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "teachers":
        return <TeacherManagement />;
      case "courses":
        return <CourseManagement />;
      case "students":
        return <StudentManagement />;
      case "lessons":
        return <LessonManagement />;
      case "enrollments":
        return <EnrollmentManagement />;
      case "progress":
        return <LessonProgressManagement />;
      default:
        return <TeacherManagement />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎓 Learning Management System</h1>
        <p>Manage teachers, courses, students, and track learning progress</p>
      </header>

      <nav className="app-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="icon">{tab.icon}</span>
            <span className="label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="app-main">{renderActiveComponent()}</main>

      <footer className="app-footer">
        <p>
          Learning Management System • Built with React, Apollo GraphQL &
          TypeScript
        </p>
      </footer>
    </div>
  );
}

export default App;
