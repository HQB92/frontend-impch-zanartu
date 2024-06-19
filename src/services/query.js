import  {  gql  }  from  '@apollo/client' ;

const GET_PROFILE = gql`
    query miProfile($rut: ID!) {
        Member {
            getByRut(rut: $rut) {
                names
                lastNameDad
                lastNameMom
                address
                email
                mobile
                sexo
            }
        }
    }
`;

const GET_ALL_MEMBERS = gql`
    query GetAll {
        Member {
            getAll {
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
            }
        }
    }
`;

const COUNT_ALL_MEMBERS = gql`
    query Count {
        Member {
            count
        }
    }
`;

const GET_MEMBER_BY_RUT = gql`
    query GetMemberByRut($rut: ID!) {
        Member {
            getByRut(rut: $rut) {
                rut,
                names,
                lastNameDad,
                lastNameMom,
                dateOfBirth,
                address,
                telephone,
                mobile,
                email,
                maritalStatus,
                probationStartDate,
                fullMembershipDate,
                churchId,
                statusId,
                userId,
                sexo,
            }
        }
    }
`;
export { GET_PROFILE, GET_ALL_MEMBERS, COUNT_ALL_MEMBERS, GET_MEMBER_BY_RUT};


