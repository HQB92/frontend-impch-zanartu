import { gql } from '@apollo/client';
import GetProfile from './graphql/query/GetProfile';
import GetAllMember from './graphql/query/GetAllMember';
import GetCountAllMember from './graphql/query/GetCountAllMember';
import GetAllUser from './graphql/query/GetAllUser';
import GetAllBaptism from './graphql/query/GetAllBaptism';
import GetBaptismByChildRut from './graphql/query/GetBaptismByChildRut';
import GetAllMerriage from './graphql/query/GetAllMerriage';
import GetAllOfferings from './graphql/query/GetAllOfferings';
import GetAllChurch from './graphql/query/GetAllChurch';
import GetAllBank from './graphql/query/GetAllBank';

const GET_PROFILE = gql`
    ${GetProfile}
`;

const GET_ALL_MEMBERS = gql`
    ${GetAllMember}
`;

const COUNT_ALL_MEMBERS = gql`
    ${GetCountAllMember}
`;

const GET_ALL_USER = gql`
    ${GetAllUser}
`;

const GET_ALL_BAPTISM = gql`
    ${GetAllBaptism}
`;

const GET_BAPTISM_BY_CHILD_RUT = gql`
    ${GetBaptismByChildRut}
`;

const GET_ALL_MERRIAGE = gql`
    ${GetAllMerriage}
`;

const GET_ALL_OFFERINGS = gql`
    ${GetAllOfferings}
`;

const GET_ALL_CHURCH = gql`
    ${GetAllChurch}
`;

const GET_ALL_BANK = gql`
    ${GetAllBank}
`;

export {
  GET_PROFILE,
  GET_ALL_MEMBERS,
  COUNT_ALL_MEMBERS,
  GET_ALL_USER,
  GET_ALL_BAPTISM,
  GET_BAPTISM_BY_CHILD_RUT,
  GET_ALL_MERRIAGE,
  GET_ALL_OFFERINGS,
  GET_ALL_CHURCH,
  GET_ALL_BANK,
};
