const UpdateOffering = `mutation UpdateOffering($id: Int!, $offering: OfferingInput!) {
    Offering {
        update(id: $id, offering: $offering) {
            code
            message
        }
    }
}`;

export default UpdateOffering;
