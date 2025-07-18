import { gql } from "@apollo/client";

export const GET_COURSES = gql`
  query GetCourses {
    courses {
      id
      title
      description
      duration_hours
      teacher_id
      teacher {
        id
        name
        area
      }
      lessons {
        course_id
        sequence_number
        title
        content
      }
      students {
        id
        name
        email
      }
    }
  }
`;
