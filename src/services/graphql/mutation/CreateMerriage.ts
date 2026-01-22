const CreateMerriage = `mutation CreateMerriage($merriageRecord: MerriageRecordInput!) {
    MerriageRecord {
        create(merriageRecord: $merriageRecord) {
            code
            message
        }
    }
}`;

export default CreateMerriage;
