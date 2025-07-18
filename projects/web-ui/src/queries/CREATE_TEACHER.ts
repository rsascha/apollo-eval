import { gql } from "@apollo/client";

export const CREATE_TEACHER = gql`
  mutation CreateTeacher($input: CreateTeacherInput!) {
    createTeacher(input: $input) {
      id
      name
      area
    }
  }
`;
