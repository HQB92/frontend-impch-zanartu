import { gql } from "@apollo/client";
import CreateBaptism from "./graphql/mutation/CreateBaptism.graphql";
import CreateMember from "./graphql/mutation/CreateMember.graphql";
import DeleteMember from "./graphql/mutation/DeleteMember.graphql";
import UpdateMember from "./graphql/mutation/UpdateMember.graphql";
import ChangePassword from "./graphql/mutation/ChangePassword.graphql";


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
export { CREATE_MEMBER,
         DELETE_MEMBER,
         UPDATE_MEMBER,
         CHANGE_PASSWORD,
         CREATE_BAPTISM 
       };