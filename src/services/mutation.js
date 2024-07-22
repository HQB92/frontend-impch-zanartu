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

const DELETE_MEMBER = gql`
mutation Delete($rut: String!) {
  Member {
    delete(rut: $rut) {
      code
      message
    }
  }
}`;

const UPDATE_MEMBER = gql`
mutation Update($member: MemberInput!) {
    Member {
        update(member: $member) {
        code
        message
        }
    }
}`;

const CHANGE_PASSWORD = gql`
mutation ChangePassword($id: ID!, $password: String!) {
  User {
    changePassword(id: $id, password: $password) {
      code
      message
    }
  }
}`;

const CREATE_BAPTISM = gql`
mutation Mutation($baptismRecord: BaptismRecordInput!) {
  BaptismRecord {
    create(baptismRecord: $baptismRecord) {
      code
      message
    }
  }
}
`;

const UPDATE_BAPTISM = gql`
mutation Mutation($baptismRecord: BaptismRecordInput!) {
    BaptismRecord {
        update(baptismRecord: $baptismRecord) {
            code
            message
        }
    }
}
`;




export { CREATE_MEMBER, UPDATE_PASSWORD, DELETE_MEMBER, UPDATE_MEMBER, CHANGE_PASSWORD, CREATE_BAPTISM, UPDATE_BAPTISM };