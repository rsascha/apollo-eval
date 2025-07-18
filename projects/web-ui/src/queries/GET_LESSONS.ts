import { gql } from "@apollo/client";

export const GET_LESSONS = gql`
  query GetLessons {
    lessons {
      course_id
      sequence_number
      title
      content
      course {
        id
        title
        teacher {
          name
        }
      }
    }
  }
`;
