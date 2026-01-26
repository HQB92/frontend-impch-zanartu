const GetAllRehearsals = `query GetAllRehearsals {
    Rehearsal {
        getAll {
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

export default GetAllRehearsals;
