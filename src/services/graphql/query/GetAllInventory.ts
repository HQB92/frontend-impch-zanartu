const GetAllInventory = `
query GetAllInventory {
    Inventory {
        getAll {
            id
            churchId
            year
            date
            observations
            church {
                id
                name
                address
            }
            buildingDetails {
                id
                propertyArea
                builtArea
                wallTypes
                floorTypes
                ceilingTypes
                roofCovering
                propertyEnclosure
                numberOfDoors
                numberOfWindows
                electricalEnergy
                electricalEnergyOther
                water
                waterOther
                bathroomDetails
                diningRoomDetails
            }
            items {
                id
                itemName
                category
                hasItem
                quantity
            }
        }
    }
}
`;

export default GetAllInventory;
