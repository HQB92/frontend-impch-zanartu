import {gql} from "@apollo/client";
import CreateBaptism from "./graphql/mutation/CreateBaptism.graphql";
import CreateMember from "./graphql/mutation/CreateMember.graphql";
import DeleteMember from "./graphql/mutation/DeleteMember.graphql";
import UpdateMember from "./graphql/mutation/UpdateMember.graphql";
import ChangePassword from "./graphql/mutation/ChangePassword.graphql";
import ResetPassword from "./graphql/mutation/ResetPassword.graphql";
import DeleteUser from "./graphql/mutation/DeleteUser.graphql";
import CreateUser from "./graphql/mutation/CreateUser.graphql";
import CreateMerriage from "./graphql/mutation/CreateMerriage.graphql";
import CreateOffering from "./graphql/mutation/CreateOffering.graphql";

const CREATE_MEMBER = gql`
    ${CreateMember}
`;

const DELETE_MEMBER = gql`
    ${DeleteMember}
`;

const UPDATE_MEMBER = gql`
    ${UpdateMember}
`;

const CHANGE_PASSWORD = gql`
    ${ChangePassword}
`;

const CREATE_BAPTISM = gql`
    ${CreateBaptism}
`;

const RESET_PASSWORD = gql`
    ${ResetPassword}
`;

const DELETE_USER = gql`
    ${DeleteUser}
`;
const CREATE_USER = gql`
    ${CreateUser}
`;
const CREATE_MERRIAGE = gql`
    ${CreateMerriage}
`;

const CREATE_OFFERING = gql`
    ${CreateOffering}
`;

export {
  CREATE_MEMBER,
  DELETE_MEMBER,
  UPDATE_MEMBER,
  CHANGE_PASSWORD,
  CREATE_BAPTISM,
  RESET_PASSWORD,
  DELETE_USER,
  CREATE_USER,
  CREATE_MERRIAGE,
  CREATE_OFFERING
};