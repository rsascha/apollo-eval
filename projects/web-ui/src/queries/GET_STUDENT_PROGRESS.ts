import { gql } from "@apollo/client";

export const GET_STUDENT_PROGRESS = gql`
  query GetStudentProgress($courseId: Int!, $studentId: Int!) {
    studentProgress(courseId: $courseId, studentId: $studentId) {
      course_id
      sequence_number
      title
      content
    }
  }
`;
