import { Request, Response } from "express";
import { handleErrors } from "../config/utils";
import { defaultResponse } from "../interfaces/default.interface";
import * as authService from "../services/auth.service";


export async function login(req: Request, res: Response) {
  try {
    const { usuario, senha } = req.body;
    const result = await authService.getLogin({ usuario, senha });
    res.cookie("rfrshNomeSite", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    const { refreshToken, ...data } = result;
    res.json(data);
  } catch (error: any) {
    const msg = [
      "obrigatórios",
      "Credenciais inválidas",
      "Usuário não encontrado.",
    ];
    if (msg.some((m) => error.message.includes(m)))
      return res
        .status(400)
        .json(handleErrors({ code: -11000 }, error.message));

    if (error.message.includes("ER-01"))
      return res
        .status(429)
        .json(handleErrors({ code: -11000 }, `01 - ${error.message.slice(6)}`));

    if (error.message.includes("suspensa"))
      return res.status(403).json(handleErrors(error));

    return res
      .status(500)
      .json(handleErrors(error, "Erro ao solicitar código de login"));
  }
}
export async function refreshToken(req: Request, res: Response) {
  const refreshToken = req.cookies.rfrshNomeSite;
  try {
    const response = await authService.refreshToken(refreshToken);
    res.json(response);
  } catch (error: any) {
    const msg = [
      "obrigatórios",
      "Credenciais inválidas",
      "Usuário não encontrado.",
    ];
    if (msg.some((m) => error.message.includes(m)))
      return res
        .status(401)
        .json(handleErrors({ code: -11000 }, error.message));

    if (error.message.includes("suspensa"))
      return res.status(403).json(handleErrors(error));

    return res
      .status(500)
      .json(handleErrors(error, "Erro ao solicitar refresh"));
  }
}
export function logout(req: Request, res: Response) {
  res.clearCookie("rfrshNomeSite", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  return res.status(200).json(defaultResponse("Logout realizado com sucesso.", true));
}
