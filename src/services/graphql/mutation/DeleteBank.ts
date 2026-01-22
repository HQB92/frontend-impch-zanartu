const DeleteBank = `mutation DeleteBank($id: ID!) {
    Bank {
        delete(id: $id) {
            code
            message
        }
    }
}`;

export default DeleteBank;
