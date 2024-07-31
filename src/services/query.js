import  {  gql  }  from  '@apollo/client' ;
import GetAllUser from './graphql/query/GetAllUser.graphql';
import GetAllMember from './graphql/query/GetAllMember.graphql';
import GetMemberByRut from './graphql/query/GetMemberByRut.graphql';
import GetAllBaptism from './graphql/query/GetAllBaptism.graphql';
import GetBaptismByChildRut from './graphql/query/GetBaptismByChildRut.graphql';
import GetProfile from './graphql/query/GetProfile.graphql';
import GetCountAllMembers from './graphql/query/GetCountAllMember.graphql';
import GetAllMerriage from './graphql/query/GetAllMerriage.graphql';

const GET_PROFILE = gql`
    ${GetProfile}
`;
const GET_ALL_MEMBERS = gql`
    ${GetAllMember}
`;
const COUNT_ALL_MEMBERS = gql`
    ${GetCountAllMembers}
`;
const GET_MEMBER_BY_RUT = gql`
    ${GetMemberByRut}
`;
const GET_ALL_BAPTISM = gql`
    ${GetAllBaptism}
`;
const GET_BAPTISM_BY_CHILD_RUT = gql`
    ${GetBaptismByChildRut}
`;
const GET_ALL_USER = gql`
    ${GetAllUser}
`;

const GET_ALL_MERRIAGE = gql`
    ${GetAllMerriage}
`;

export { GET_PROFILE,
         GET_ALL_MEMBERS,
         COUNT_ALL_MEMBERS,
         GET_MEMBER_BY_RUT,
         GET_ALL_BAPTISM,
         GET_BAPTISM_BY_CHILD_RUT,
         GET_ALL_USER,
         GET_ALL_MERRIAGE
    };


