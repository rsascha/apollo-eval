import { gql } from "@apollo/client";

export const COMPLETE_LESSON = gql`
  mutation CompleteLesson($input: CompleteLessonInput!) {
    completeLesson(input: $input) {
      course_id
      sequence_number
      student_id
      finished
      lesson {
        title
      }
      student {
        name
      }
    }
  }
`;
