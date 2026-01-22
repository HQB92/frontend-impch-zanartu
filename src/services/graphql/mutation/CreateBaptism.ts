const CreateBaptism = `mutation CreateBaptism($baptismRecord: BaptismRecordInput!) {
    BaptismRecord {
        create(baptismRecord: $baptismRecord) {
            code
            message
        }
    }
}`;

export default CreateBaptism;
