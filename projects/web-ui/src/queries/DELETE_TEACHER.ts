import { gql } from "@apollo/client";

export const DELETE_TEACHER = gql`
  mutation DeleteTeacher($id: Int!) {
    deleteTeacher(id: $id)
  }
`;
