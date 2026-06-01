const UpdateExpense = `mutation UpdateExpense($id: ID!, $expense: ExpenseInput!) {
    Expense {
        update(id: $id, expense: $expense) {
            code
            message
        }
    }
}`;

export default UpdateExpense;
