const UpdateMember = `mutation UpdateMember($member: MemberInput!) {
    Member {
        update(member: $member) {
            code
            message
        }
    }
}`;

export default UpdateMember;
