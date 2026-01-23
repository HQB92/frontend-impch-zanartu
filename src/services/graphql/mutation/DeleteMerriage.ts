const DeleteMerriage = `mutation DeleteMerriage($id: ID!) {
    MerriageRecord {
        delete(id: $id) {
            code
            message
        }
    }
}`;

export default DeleteMerriage;
