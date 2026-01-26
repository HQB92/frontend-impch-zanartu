const GetAllMember = `query GetAllMember($churchId: Int , $typeMember: Int) {
    Member {
        getAll(churchId: $churchId , typeMember: $typeMember) {
            rut
            names
            lastNameDad
            lastNameMom
            address
            mobile
            dateOfBirth
            probationStartDate
            fullMembershipDate
            sexo
            isCorosUnidos
        }
    }
}`;

export default GetAllMember;
