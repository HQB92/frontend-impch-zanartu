const CreateBank = `mutation CreateBank($bank: BankInput!) {
    Bank {
        create(bank: $bank) {
            code
            message
        }
    }
}`;

export default CreateBank;
