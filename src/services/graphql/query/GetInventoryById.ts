const GetInventoryById = `
query GetInventoryById($id: ID!) {
    Inventory {
        getById(id: $id) {
            id
            churchId
            year
            date
            observations
            church {
                id
                name
                address
                distanceToMotherTemple
                pastor
                landlinePhone
                mobilePhone
                capacity
                sectorNumber
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

export default GetInventoryById;
