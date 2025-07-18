import { gql } from "@apollo/client";

export const UPDATE_STUDENT = gql`
  mutation UpdateStudent($id: Int!, $input: CreateStudentInput!) {
    updateStudent(id: $id, input: $input) {
      id
      name
      email
    }
  }
`;
