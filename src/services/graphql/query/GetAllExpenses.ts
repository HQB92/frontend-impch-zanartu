const GetAllExpenses = `query GetAllExpenses($churchId: Int, $mes: Int, $anio: Int, $source: String) {
    Expense {
        getAll(churchId: $churchId, mes: $mes, anio: $anio, source: $source) {
            id
            amount
            date
            type
            description
            source
            churchId
            userId
        }
    }
}`;

export default GetAllExpenses;
