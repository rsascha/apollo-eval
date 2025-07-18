import { gql } from "@apollo/client";

export const UPDATE_TEACHER = gql`
  mutation UpdateTeacher($id: Int!, $input: CreateTeacherInput!) {
    updateTeacher(id: $id, input: $input) {
      id
      name
      area
    }
  }
`;
