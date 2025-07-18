import { gql } from "@apollo/client";

export const UPDATE_LESSON = gql`
  mutation UpdateLesson(
    $courseId: Int!
    $sequenceNumber: Int!
    $title: String
    $content: String
  ) {
    updateLesson(
      courseId: $courseId
      sequenceNumber: $sequenceNumber
      title: $title
      content: $content
    ) {
      course_id
      sequence_number
      title
      content
    }
  }
`;
