import { gql } from "@apollo/client";

export const ENROLL_STUDENT = gql`
  mutation EnrollStudent($input: EnrollStudentInput!) {
    enrollStudent(input: $input) {
      course_id
      student_id
      course {
        title
      }
      student {
        name
      }
    }
  }
`;
