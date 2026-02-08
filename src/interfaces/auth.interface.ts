import { padraoResponse } from "./default.interface";

export interface loginRequest {
    usuario: string;
    senha: string;
}

export interface loginResponse extends padraoResponse {
    token: string;
    refreshToken: string;
}

export interface refreshResponse extends padraoResponse {
    token: string;
}