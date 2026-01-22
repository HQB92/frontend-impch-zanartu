const GetAllChurch = `query GetAllChurch {
    Church {
        getAll {
            id
            name
            address
        }
    }
}`;

export default GetAllChurch;
