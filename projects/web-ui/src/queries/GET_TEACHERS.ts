import { gql } from "@apollo/client";

export const GET_TEACHERS = gql`
  query GetTeachers {
    teachers {
      id
      name
      area
      courses {
        id
        title
        description
        duration_hours
      }
    }
  }
`;
