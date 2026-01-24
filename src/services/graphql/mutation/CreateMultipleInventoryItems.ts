const CreateMultipleInventoryItems = `
mutation CreateMultipleInventoryItems($items: [InventoryItemInput!]!) {
    Inventory {
        createMultipleInventoryItems(items: $items) {
            code
            message
        }
    }
}
`;

export default CreateMultipleInventoryItems;
