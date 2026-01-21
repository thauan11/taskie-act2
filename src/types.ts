export interface Note {
  id: string;
  // user: User;
  status: Status;
  // titulo: string;
  texto: string;
  createdAt: string;
  updatedAt: string;
  finishAt: string;
}

export interface User {
  id: string;
  nome: string;
  senha: string;
}

export interface Status {
  id: string;
  nome: string;
}