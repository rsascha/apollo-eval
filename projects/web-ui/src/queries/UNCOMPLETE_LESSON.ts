import { gql } from "@apollo/client";

export const UNCOMPLETE_LESSON = gql`
  mutation UncompleteLesson(
    $courseId: Int!
    $sequenceNumber: Int!
    $studentId: Int!
  ) {
    uncompleteLesson(
      courseId: $courseId
      sequenceNumber: $sequenceNumber
      studentId: $studentId
    )
  }
`;
