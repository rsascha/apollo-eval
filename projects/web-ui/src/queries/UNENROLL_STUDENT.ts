import { gql } from "@apollo/client";

export const UNENROLL_STUDENT = gql`
  mutation UnenrollStudent($courseId: Int!, $studentId: Int!) {
    unenrollStudent(courseId: $courseId, studentId: $studentId)
  }
`;
