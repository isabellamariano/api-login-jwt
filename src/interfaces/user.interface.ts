export type UserRole = 'admin' | 'moderador' | 'usuario';

export interface Coordenadas {
    lat: number;
    lng: number;
}

export interface Endereco {
    logradouro: string;
    cidade: string;
    estado: string;
    uf: string;
    cep: string;
    coordenadas: Coordenadas;
    pais: string;
}

export interface User {
    id: number;
    nome: string;
    sobrenome: string;
    usuario: string;
    senha?: string;
    dataNascimento: string;
    email: string;
    endereco: Endereco;
    role: UserRole;
    status: string;
}

export type userResponse =
    | { status: true; status_descricao: string; user: User; }
    | { status: false; status_descricao: string; };