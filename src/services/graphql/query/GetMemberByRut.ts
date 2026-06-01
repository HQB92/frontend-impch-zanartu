const GetMemberByRut = `query GetMemberByRut($rut: ID!) {
    Member {
        getByRut(rut: $rut) {
            rut
            names
            lastNameDad
            lastNameMom
            dateOfBirth
            address
            telephone
            mobile
            email
            maritalStatus
            probationStartDate
            fullMembershipDate
            churchId
            statusId
            sexo
            isCorosUnidos
        }
    }
}`;

export default GetMemberByRut;
