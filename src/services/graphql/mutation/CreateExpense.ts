const CreateExpense = `mutation CreateExpense($expense: ExpenseInput!) {
    Expense {
        create(expense: $expense) {
            code
            message
        }
    }
}`;

export default CreateExpense;
