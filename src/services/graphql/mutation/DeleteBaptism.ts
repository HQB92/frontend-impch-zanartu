const DeleteBaptism = `mutation DeleteBaptism($childRUT: ID!) {
    BaptismRecord {
        delete(childRUT: $childRUT) {
            code
            message
        }
    }
}`;

export default DeleteBaptism;
