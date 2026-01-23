declare module 'rutjs' {
  class Rut {
    constructor(rut: string);
    getNiceRut(): string;
    isValid: boolean;
  }
  export default Rut;
}
