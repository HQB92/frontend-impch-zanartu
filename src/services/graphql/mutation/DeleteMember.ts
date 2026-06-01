const DeleteMember = `mutation DeleteMember($rut: String!) {
    Member {
        delete(rut: $rut) {
            code
            message
        }
    }
}`;

export default DeleteMember;
