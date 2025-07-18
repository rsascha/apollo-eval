import { gql } from "@apollo/client";

export const GET_ENROLLMENTS = gql`
  query GetEnrollments {
    enrollments {
      course_id
      student_id
      course {
        id
        title
        teacher {
          name
        }
      }
      student {
        id
        name
        email
      }
    }
  }
`;
