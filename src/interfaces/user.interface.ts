export interface user {
    id: string;
    usuario: string;
    situacao: string;
}

export type userLoginResponse =
    | { status: true; user: user; status_descricao: string; }
    | { status: false; status_descricao: string; };