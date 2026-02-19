import * as utils from "../config/utils";
import {
  loginRequest,
  loginResponse,
  refreshResponse,
} from "../interfaces/auth.interface";
import { jwtPayload } from "../interfaces/jwtPayload.interface";
import { userResponse } from "../interfaces/user.interface";
import * as userModel from "../models/user.model";

export async function getLogin(param: loginRequest): Promise<loginResponse> {
  if (!param.usuario || !param.senha) {
    throw new Error("Usuário/Senha são obrigatórios");
  }

  const resp = (await userModel.checkUser(param)) as userResponse;

  if (!resp.status) {
    throw new Error(resp.status_descricao || "Usuário Não Encontrado");
  }

  const payload: jwtPayload = {
    id: resp.user.id,
    usuario: resp.user.usuario,
    roles: [resp.user.role],
  };
  const payload2 = {
    id: resp.user.id,
    usuario: resp.user.usuario,
  };

  const token = utils.createToken(payload);
  delete payload.roles;
  const refreshToken = utils.refreshToken(payload2);

  return {
    status: resp.status,
    status_descricao: resp.status_descricao,
    token,
    refreshToken,
  };
}

export async function refreshToken(rftk: string): Promise<refreshResponse> {
  if (!rftk) {
    throw new Error("Refresh Token não existente");
  }

  const rtk = utils.validaRTK(rftk);

  const resp = (await userModel.findById(rtk.id)) as userResponse;
  if (!resp.status) {
    throw new Error("Usuário Não Encontrado");
  }

  if (resp.user.status === "suspended") {
    throw new Error("Conta suspensa/inativa. Entre em contato com o suporte.");
  }

  const payload: jwtPayload = {
    id: resp.user.id,
    usuario: resp.user.usuario,
    roles: [resp.user.role],
  };

  const token = utils.createToken(payload);
  if (token) {
    resp.status_descricao = "Token Atualizado";
  }

  return {
    status: resp.status,
    status_descricao: resp.status_descricao,
    token,
  };
}
