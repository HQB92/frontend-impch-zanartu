const DeleteInventory = `
mutation DeleteInventory($id: ID!) {
    Inventory {
        delete(id: $id) {
            code
            message
        }
    }
}
`;

export default DeleteInventory;
