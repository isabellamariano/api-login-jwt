import * as utils from "../config/utils";
import {
  loginRequest,
  loginResponse,
  refreshResponse,
} from "../interfaces/auth.interface";
import { jwtPayload } from "../interfaces/jwtPayload.interface";
import { userLoginResponse } from "../interfaces/user.interface";
import * as userModel from "../models/user.model";

export async function getLogin(param: loginRequest): Promise<loginResponse> {
  if (!param.usuario || !param.senha) {
    throw new Error("Usuário/Senha são obrigatórios");
  }

  const resp = (await userModel.checkUser(param)) as userLoginResponse;

  if (!resp.status) {
    throw new Error(resp.status_descricao || "Usuário não encontrado.");
  }

  const payload: jwtPayload = {
    id: resp.user.id,
    usuario: resp.user.usuario,
    roles: ["ADMIN"],
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

  const resp = (await userModel.findById(rtk.id)) as userLoginResponse;
  if (!resp.status) {
    throw new Error("Usuário não encontrado");
  }

  if (resp.user.situacao === "suspended") {
    throw new Error("Conta suspensa/inativa. Entre em contato com o suporte.");
  }

  const payload: jwtPayload = {
    id: resp.user.id,
    usuario: resp.user.usuario,
    roles: ["ADMIN"],
  };

  const token = utils.createToken(payload);

  return {
    status: resp.status,
    status_descricao: resp.status_descricao,
    token,
  };
}
