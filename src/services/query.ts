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
import GetAllInventory from './graphql/query/GetAllInventory';
import GetInventoryById from './graphql/query/GetInventoryById';
import GetInventoryByChurch from './graphql/query/GetInventoryByChurch';
import GetInventoryByChurchAndYear from './graphql/query/GetInventoryByChurchAndYear';
import GetAllRehearsals from './graphql/query/GetAllRehearsals';
import GetRehearsalById from './graphql/query/GetRehearsalById';
import GetRehearsalAttendanceStats from './graphql/query/GetRehearsalAttendanceStats';
import GetAttendanceByRehearsal from './graphql/query/GetAttendanceByRehearsal';
import GetAllStatus from './graphql/query/GetAllStatus';

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

const GET_ALL_INVENTORY = gql`
    ${GetAllInventory}
`;

const GET_INVENTORY_BY_ID = gql`
    ${GetInventoryById}
`;

const GET_INVENTORY_BY_CHURCH = gql`
    ${GetInventoryByChurch}
`;

const GET_INVENTORY_BY_CHURCH_AND_YEAR = gql`
    ${GetInventoryByChurchAndYear}
`;

const GET_ALL_REHEARSALS = gql`
    ${GetAllRehearsals}
`;

const GET_REHEARSAL_BY_ID = gql`
    ${GetRehearsalById}
`;

const GET_REHEARSAL_ATTENDANCE_STATS = gql`
    ${GetRehearsalAttendanceStats}
`;

const GET_ATTENDANCE_BY_REHEARSAL = gql`
    ${GetAttendanceByRehearsal}
`;

const GET_ALL_STATUS = gql`
    ${GetAllStatus}
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
  GET_ALL_INVENTORY,
  GET_INVENTORY_BY_ID,
  GET_INVENTORY_BY_CHURCH,
  GET_INVENTORY_BY_CHURCH_AND_YEAR,
  GET_ALL_REHEARSALS,
  GET_REHEARSAL_BY_ID,
  GET_REHEARSAL_ATTENDANCE_STATS,
  GET_ATTENDANCE_BY_REHEARSAL,
  GET_ALL_STATUS,
};
