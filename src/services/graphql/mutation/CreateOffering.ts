const CreateOffering = `mutation CreateOffering($offering: OfferingInput!) {
    Offering {
        create(offering: $offering) {
            code
            message
        }
    }
}`;

export default CreateOffering;
