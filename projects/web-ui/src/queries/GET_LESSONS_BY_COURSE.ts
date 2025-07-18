import { gql } from "@apollo/client";

export const GET_LESSONS_BY_COURSE = gql`
  query GetLessonsByCourse($courseId: Int!) {
    lessonsByCourse(courseId: $courseId) {
      course_id
      sequence_number
      title
      content
    }
  }
`;
