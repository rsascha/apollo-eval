import { gql } from "@apollo/client";

export const CREATE_COURSE = gql`
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
      id
      title
      description
      duration_hours
      teacher_id
      teacher {
        id
        name
      }
    }
  }
`;
