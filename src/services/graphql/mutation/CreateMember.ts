const CreateMember = `mutation CreateMember($member: MemberInput!) {
    Member {
        create(member: $member) {
            code
            message
        }
    }
}`;

export default CreateMember;
