import { gql } from '@apollo/client';

export interface ServiceResult {
  code: number;
  message: string;
}

export interface SectorChurchInfo {
  id: string;
  name: string;
  pastor: string | null;
  address: string | null;
  phone: string | null;
}

export interface SectorBaptism {
  id: string;
  sectorChurchId: string;
  sectorChurchName: string | null;
  childRUT: string;
  childFullName: string;
  childDateOfBirth: string;
  fatherRUT: string | null;
  fatherFullName: string | null;
  motherRUT: string;
  motherFullName: string;
  placeOfRegistration: string;
  baptismDate: string;
  registrationNumber: string;
  registrationDate: string;
}

export interface SectorMerriage {
  id: string;
  sectorChurchId: string;
  sectorChurchName: string | null;
  husbandId: string;
  fullNameHusband: string;
  wifeId: string;
  fullNameWife: string;
  civilCode: number;
  civilDate: string;
  civilPlace: string;
  religiousDate: string;
}

const BAPTISM_FIELDS = `
  id
  sectorChurchId
  sectorChurchName
  childRUT
  childFullName
  childDateOfBirth
  fatherRUT
  fatherFullName
  motherRUT
  motherFullName
  placeOfRegistration
  baptismDate
  registrationNumber
  registrationDate
`;

const MERRIAGE_FIELDS = `
  id
  sectorChurchId
  sectorChurchName
  husbandId
  fullNameHusband
  wifeId
  fullNameWife
  civilCode
  civilDate
  civilPlace
  religiousDate
`;

// Los nombres de las variables deben coincidir con los de los argumentos:
// el backend también los lee por nombre.

export const GET_ALL_SECTOR_BAPTISM = gql`
  query GetAllSectorBaptism($sectorChurchId: ID) {
    SectorBaptismRecord {
      getAll(sectorChurchId: $sectorChurchId) { ${BAPTISM_FIELDS} }
    }
  }
`;

export const GET_SECTOR_BAPTISM_BY_ID = gql`
  query GetSectorBaptismById($id: ID!) {
    SectorBaptismRecord {
      getById(id: $id) { ${BAPTISM_FIELDS} }
    }
  }
`;

export const CREATE_SECTOR_BAPTISM = gql`
  mutation CreateSectorBaptism($baptismRecord: BaptismRecordInput!) {
    SectorBaptismRecord {
      create(baptismRecord: $baptismRecord) { code message }
    }
  }
`;

export const UPDATE_SECTOR_BAPTISM = gql`
  mutation UpdateSectorBaptism($id: ID!, $baptismRecord: BaptismRecordInput!) {
    SectorBaptismRecord {
      update(id: $id, baptismRecord: $baptismRecord) { code message }
    }
  }
`;

export const DELETE_SECTOR_BAPTISM = gql`
  mutation DeleteSectorBaptism($id: ID!) {
    SectorBaptismRecord {
      delete(id: $id) { code message }
    }
  }
`;

export const GET_ALL_SECTOR_MERRIAGE = gql`
  query GetAllSectorMerriage($sectorChurchId: ID) {
    SectorMerriageRecord {
      getAll(sectorChurchId: $sectorChurchId) { ${MERRIAGE_FIELDS} }
    }
  }
`;

export const GET_SECTOR_MERRIAGE_BY_ID = gql`
  query GetSectorMerriageById($id: ID!) {
    SectorMerriageRecord {
      getById(id: $id) { ${MERRIAGE_FIELDS} }
    }
  }
`;

export const CREATE_SECTOR_MERRIAGE = gql`
  mutation CreateSectorMerriage($merriageRecord: MerriageRecordInput!) {
    SectorMerriageRecord {
      create(merriageRecord: $merriageRecord) { code message }
    }
  }
`;

export const UPDATE_SECTOR_MERRIAGE = gql`
  mutation UpdateSectorMerriage($id: ID!, $merriageRecord: MerriageRecordInput!) {
    SectorMerriageRecord {
      update(id: $id, merriageRecord: $merriageRecord) { code message }
    }
  }
`;

export const DELETE_SECTOR_MERRIAGE = gql`
  mutation DeleteSectorMerriage($id: ID!) {
    SectorMerriageRecord {
      delete(id: $id) { code message }
    }
  }
`;

export const GET_SECTOR_CHURCHES = gql`
  query GetSectorChurches {
    SectorChurch {
      getAll { id name }
    }
  }
`;

export const GET_SECTOR_PROFILE = gql`
  query GetSectorProfile {
    SectorChurch {
      me { id name pastor address phone }
    }
  }
`;

export const UPDATE_SECTOR_PROFILE = gql`
  mutation UpdateSectorProfile($pastor: String, $address: String, $phone: String) {
    SectorChurch {
      updateProfile(pastor: $pastor, address: $address, phone: $phone) { code message }
    }
  }
`;

export const CHANGE_SECTOR_PASSWORD = gql`
  mutation ChangeSectorPassword($currentPassword: String!, $newPassword: String!) {
    SectorChurch {
      changePassword(currentPassword: $currentPassword, newPassword: $newPassword) { code message }
    }
  }
`;

export const GET_SECTOR_COUNTS = gql`
  query GetSectorCounts {
    SectorBaptismRecord { count }
    SectorMerriageRecord { count }
  }
`;
