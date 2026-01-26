const UpdateRehearsal = `mutation UpdateRehearsal($rehearsal: RehearsalInput!) {
    Rehearsal {
        update(rehearsal: $rehearsal) {
            code
            message
            data
        }
    }
}`;

export default UpdateRehearsal;
