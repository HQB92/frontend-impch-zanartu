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

export { GET_PROFILE, GET_ALL_MEMBERS };


