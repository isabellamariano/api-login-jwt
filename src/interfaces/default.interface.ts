export interface padraoResponse {
    status: boolean;
    status_descricao: string;
}

export const defaultResponse = (descricao: string, status = false): padraoResponse => ({
    status,
    status_descricao: descricao
});