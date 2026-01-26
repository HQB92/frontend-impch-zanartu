const RegisterAttendance = `mutation RegisterAttendance($rehearsalId: ID!, $memberRut: ID!) {
    Attendance {
        register(rehearsalId: $rehearsalId, memberRut: $memberRut) {
            code
            message
            data
        }
    }
}`;

export default RegisterAttendance;
