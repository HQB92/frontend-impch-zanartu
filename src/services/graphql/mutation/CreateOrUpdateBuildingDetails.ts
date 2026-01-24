const CreateOrUpdateBuildingDetails = `
mutation CreateOrUpdateBuildingDetails($buildingDetails: BuildingDetailsInput!) {
    Inventory {
        createOrUpdateBuildingDetails(buildingDetails: $buildingDetails) {
            code
            message
        }
    }
}
`;

export default CreateOrUpdateBuildingDetails;
