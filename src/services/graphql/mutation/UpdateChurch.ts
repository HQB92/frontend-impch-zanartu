const UpdateChurch = `mutation UpdateChurch($id: ID!, $name: String, $address: String) {
    Church {
        update(id: $id, name: $name, address: $address) {
            code
            message
        }
    }
}`;

export default UpdateChurch;
