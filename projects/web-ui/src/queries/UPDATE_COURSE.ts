import { gql } from "@apollo/client";

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($id: Int!, $input: CreateCourseInput!) {
    updateCourse(id: $id, input: $input) {
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
