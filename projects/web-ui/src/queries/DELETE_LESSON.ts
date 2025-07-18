import { gql } from "@apollo/client";

export const DELETE_LESSON = gql`
  mutation DeleteLesson($courseId: Int!, $sequenceNumber: Int!) {
    deleteLesson(courseId: $courseId, sequenceNumber: $sequenceNumber)
  }
`;
