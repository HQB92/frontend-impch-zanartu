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
import DeleteMerriage from './graphql/mutation/DeleteMerriage';
import DeleteBaptism from './graphql/mutation/DeleteBaptism';
import CreateInventory from './graphql/mutation/CreateInventory';
import UpdateInventory from './graphql/mutation/UpdateInventory';
import DeleteInventory from './graphql/mutation/DeleteInventory';
import CreateOrUpdateBuildingDetails from './graphql/mutation/CreateOrUpdateBuildingDetails';
import CreateMultipleInventoryItems from './graphql/mutation/CreateMultipleInventoryItems';
import CreateRehearsal from './graphql/mutation/CreateRehearsal';
import UpdateRehearsal from './graphql/mutation/UpdateRehearsal';
import DeleteRehearsal from './graphql/mutation/DeleteRehearsal';
import RegisterAttendance from './graphql/mutation/RegisterAttendance';
import DeleteAttendance from './graphql/mutation/DeleteAttendance';

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

const DELETE_MERRIAGE = gql`
    ${DeleteMerriage}
`;

const DELETE_BAPTISM = gql`
    ${DeleteBaptism}
`;

const CREATE_INVENTORY = gql`
    ${CreateInventory}
`;

const UPDATE_INVENTORY = gql`
    ${UpdateInventory}
`;

const DELETE_INVENTORY = gql`
    ${DeleteInventory}
`;

const CREATE_OR_UPDATE_BUILDING_DETAILS = gql`
    ${CreateOrUpdateBuildingDetails}
`;

const CREATE_MULTIPLE_INVENTORY_ITEMS = gql`
    ${CreateMultipleInventoryItems}
`;

const CREATE_REHEARSAL = gql`
    ${CreateRehearsal}
`;

const UPDATE_REHEARSAL = gql`
    ${UpdateRehearsal}
`;

const DELETE_REHEARSAL = gql`
    ${DeleteRehearsal}
`;

const REGISTER_ATTENDANCE = gql`
    ${RegisterAttendance}
`;

const DELETE_ATTENDANCE = gql`
    ${DeleteAttendance}
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
  DELETE_MERRIAGE,
  DELETE_BAPTISM,
  CREATE_INVENTORY,
  UPDATE_INVENTORY,
  DELETE_INVENTORY,
  CREATE_OR_UPDATE_BUILDING_DETAILS,
  CREATE_MULTIPLE_INVENTORY_ITEMS,
  CREATE_REHEARSAL,
  UPDATE_REHEARSAL,
  DELETE_REHEARSAL,
  REGISTER_ATTENDANCE,
  DELETE_ATTENDANCE,
};
