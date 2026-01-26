const GetRehearsalById = `query GetRehearsalById($id: ID!) {
    Rehearsal {
        getById(id: $id) {
            id
            date
            description
            churchId
            church {
                id
                name
                address
            }
            attendances {
                id
                memberRut
                attendedAt
                member {
                    rut
                    names
                    lastNameDad
                    lastNameMom
                }
            }
            createdAt
            updatedAt
        }
    }
}`;

export default GetRehearsalById;
