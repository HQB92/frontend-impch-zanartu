const GetAllMerriage = `query GetAllMerriage {
    MerriageRecord {
        getAll {
            id
            husbandId
            fullNameHusband
            wifeId
            fullNameWife
            civilCode
            civilDate
            civilPlace
            religiousDate
        }
    }
}`;

export default GetAllMerriage;
