import { gql } from "@apollo/client";

const CREATE_MEMBER = gql`
    mutation Create($member: MemberInput!) {
  Member {
    create(member: $member) {
      code
      message
    }
  }
}

`;

const UPDATE_PASSWORD = gql`
    mutation Update($updateId: ID!, $rut: ID!, $username: String, $email: String, $password: String) {
  User {
    update(id: $updateId, rut: $rut, username: $username, email: $email, password: $password) {
      code
      message
    }
  }
}`;

export { CREATE_MEMBER, UPDATE_PASSWORD };