import { gql } from "@apollo/client";

export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: Int!) {
    deleteCourse(id: $id)
  }
`;
