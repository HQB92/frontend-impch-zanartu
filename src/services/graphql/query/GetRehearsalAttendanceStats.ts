const GetRehearsalAttendanceStats = `query GetRehearsalAttendanceStats($rehearsalId: ID!) {
    Rehearsal {
        getAttendanceStats(rehearsalId: $rehearsalId) {
            totalMembers
            attendedMembers
            attendancePercentage
        }
    }
}`;

export default GetRehearsalAttendanceStats;
