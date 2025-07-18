import { gql } from "@apollo/client";

export const GET_STUDENTS = gql`
  query GetStudents {
    students {
      id
      name
      email
      courses {
        id
        title
        teacher {
          name
        }
      }
      completedLessons {
        course_id
        sequence_number
        student_id
        finished
        lesson {
          course_id
          sequence_number
          title
        }
      }
    }
  }
`;
