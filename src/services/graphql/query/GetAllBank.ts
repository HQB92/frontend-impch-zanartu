const GetAllBank = `query GetAllBank($churchId: Int, $mes: Int, $anio: Int) {
    Bank {
        getAll(churchId: $churchId, mes: $mes, anio: $anio) {
            id
            amount
            date
            type
            churchId
            userId
            state
            comment
        }
    }
}`;

export default GetAllBank;
