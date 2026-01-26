const DeleteAttendance = `mutation DeleteAttendance($rehearsalId: ID!, $memberRut: ID!) {
    Attendance {
        delete(rehearsalId: $rehearsalId, memberRut: $memberRut) {
            code
            message
            data
        }
    }
}`;

export default DeleteAttendance;
