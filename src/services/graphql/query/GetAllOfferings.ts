const GetAllOfferings = `query GetAllOfferings($user: Int, $churchId: Int, $mes: Int, $anio: Int) {
    Offering {
        getAll(user: $user, churchId: $churchId, mes: $mes, anio: $anio) {
            id
            amount
            date
            type
            churchId
            userId
            state
        }
    }
}`;

export default GetAllOfferings;
