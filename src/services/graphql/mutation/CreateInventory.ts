const CreateInventory = `
mutation CreateInventory($inventory: InventoryInput!) {
    Inventory {
        create(inventory: $inventory) {
            code
            message
            data
        }
    }
}
`;

export default CreateInventory;
