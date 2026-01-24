const UpdateInventory = `
mutation UpdateInventory($inventory: InventoryInput!) {
    Inventory {
        update(inventory: $inventory) {
            code
            message
            data
        }
    }
}
`;

export default UpdateInventory;
