const DeleteExpense = `mutation DeleteExpense($id: ID!) {
    Expense {
        delete(id: $id) {
            code
            message
        }
    }
}`;

export default DeleteExpense;
