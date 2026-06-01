const UpdateMerriage = `mutation UpdateMerriage($id: ID!, $merriageRecord: MerriageRecordInput!) {
    MerriageRecord {
        update(id: $id, merriageRecord: $merriageRecord) {
            code
            message
        }
    }
}`;

export default UpdateMerriage;
