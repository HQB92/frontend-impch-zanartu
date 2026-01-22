import { gql } from '@apollo/client';
import CreateMember from './graphql/mutation/CreateMember';
import UpdateMember from './graphql/mutation/UpdateMember';
import CreateBaptism from './graphql/mutation/CreateBaptism';
import CreateMerriage from './graphql/mutation/CreateMerriage';
import CreateChurch from './graphql/mutation/CreateChurch';
import UpdateChurch from './graphql/mutation/UpdateChurch';
import CreateBank from './graphql/mutation/CreateBank';
import UpdateBank from './graphql/mutation/UpdateBank';
import DeleteBank from './graphql/mutation/DeleteBank';

const CREATE_MEMBER = gql`
    ${CreateMember}
`;

const UPDATE_MEMBER = gql`
    ${UpdateMember}
`;

const CREATE_BAPTISM = gql`
    ${CreateBaptism}
`;

const CREATE_MERRIAGE = gql`
    ${CreateMerriage}
`;

const CREATE_CHURCH = gql`
    ${CreateChurch}
`;

const UPDATE_CHURCH = gql`
    ${UpdateChurch}
`;

const CREATE_BANK = gql`
    ${CreateBank}
`;

const UPDATE_BANK = gql`
    ${UpdateBank}
`;

const DELETE_BANK = gql`
    ${DeleteBank}
`;

export {
  CREATE_MEMBER,
  UPDATE_MEMBER,
  CREATE_BAPTISM,
  CREATE_MERRIAGE,
  CREATE_CHURCH,
  UPDATE_CHURCH,
  CREATE_BANK,
  UPDATE_BANK,
  DELETE_BANK,
};
