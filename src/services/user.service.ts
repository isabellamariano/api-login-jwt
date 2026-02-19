import { userResponse } from "../interfaces/user.interface";
import * as userModel from "../models/user.model";

export async function getUserById(id: number): Promise<userResponse> {
    if (!id) {
        throw new Error("Identificador não informado");
    }

    const resp = (await userModel.findById(id)) as userResponse;

    if (!resp.status) {
        throw new Error(resp.status_descricao || "Usuário Não Encontrado");
    }

    const { senha, ...dados } = resp.user;

    return {
        status: resp.status,
        status_descricao: resp.status_descricao,
        user: dados,
    };
}