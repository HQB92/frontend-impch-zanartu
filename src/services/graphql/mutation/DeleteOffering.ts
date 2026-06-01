const DeleteOffering = `mutation DeleteOffering($id: Int!) {
    Offering {
        delete(id: $id) {
            code
            message
        }
    }
}`;

export default DeleteOffering;
