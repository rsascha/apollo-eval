import { gql } from "@apollo/client";

export const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: Int!) {
    deleteStudent(id: $id)
  }
`;
