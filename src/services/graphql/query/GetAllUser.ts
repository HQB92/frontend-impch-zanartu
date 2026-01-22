const GetAllUser = `query GetAllUser {
    User {
        getAll {
            id
            rut
            username
            email
            roles
        }
    }
}`;

export default GetAllUser;
