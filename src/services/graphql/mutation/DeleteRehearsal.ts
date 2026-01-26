const DeleteRehearsal = `mutation DeleteRehearsal($id: ID!) {
    Rehearsal {
        delete(id: $id) {
            code
            message
            data
        }
    }
}`;

export default DeleteRehearsal;
