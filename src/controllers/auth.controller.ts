import { Request, Response } from "express";
import { Body, Controller, Post, Res, Response as respTSOA, Route, SuccessResponse, Tags, TsoaResponse } from "tsoa";
import { handleErrors } from "../config/utils";
import { loginRequest, refreshResponse } from "../interfaces/auth.interface";
import { defaultResponse, padraoResponse } from "../interfaces/default.interface";
import * as authService from "../services/auth.service";

@Route("auth")
@Tags("Auth")
export class AuthDocController extends Controller {

  @respTSOA<padraoResponse>(403, "Conta suspensa", {
    status: false,
    status_descricao: "Conta suspensa/inativa. Entre em contato com o suporte."
  })
  @respTSOA<padraoResponse>(422, "Problemas com Usuário", {
    status: false,
    status_descricao: "Problemas com Usuário ou os Parametros informados"
  })
  @respTSOA<padraoResponse>(500, "Erro Interno", {
    status: false,
    status_descricao: "Erro interno no servidor"
  })
  @SuccessResponse("200", "Sucesso")
  @Post("login")
  public async login(
    @Body() body: loginRequest,
    @Res() resErro: TsoaResponse<400 | 403 | 422 | 429 | 500, padraoResponse>,
  ): Promise<refreshResponse> {

    if (!body.usuario || !body.senha) {
      return resErro(400, {
        status: false,
        status_descricao: "Credenciais inválidas ou campos obrigatórios ausentes"
      });
    }
    return {} as any;
  }

  @respTSOA<padraoResponse>(403, "Acesso Negado", {
    status: false,
    status_descricao: "Conta suspensa/inativa. Entre em contato com o suporte."
  })
  @respTSOA<padraoResponse>(422, "Problemas com Usuário", {
    status: false,
    status_descricao: "Problemas com Usuário"
  })
  @respTSOA<padraoResponse>(500, "Erro de Servidor", {
    status: false,
    status_descricao: "Erro ao solicitar refresh"
  })
  @SuccessResponse("200", "Token Atualizado")
  @Post("refresh-token")
  /**
   * Atualiza o Access Token utilizando o Refresh Token armazenado no cookie HttpOnly.
   * @summary Atualizar Token
   */
  public async refreshToken(
    @Res() resErro: TsoaResponse<403 | 422 | 500, padraoResponse>
  ): Promise<refreshResponse> {
    return {} as any;
  }

  @respTSOA<padraoResponse>(500, "Erro de Servidor", {
    status: false,
    status_descricao: "Erro Interno ao deslogar"
  })
  @SuccessResponse("200", "Logout Realizado")
  @Post("logout")
  public async logout(
    @Res() resErro: TsoaResponse<500, padraoResponse>
  ): Promise<padraoResponse> {
    return {} as any;
  }
}

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

    if (error.message.includes("suspensa"))
      return res.status(403).json(handleErrors(error));

    const msg = [
      "obrigatórios",
      "Credenciais Inválidas",
      "Usuário Não Encontrado.",
    ];
    if (msg.some((m) => error.message.includes(m)))
      return res
        .status(422)
        .json(handleErrors({ code: -11000 }, error.message));

    if (error.message.includes("ER-01"))
      return res
        .status(429)
        .json(handleErrors({ code: -11000 }, `01 - ${error.message.slice(6)}`));

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

    if (error.message.includes("suspensa"))
      return res.status(403).json(handleErrors(error));

    const msg = [
      "obrigatórios",
      "Credenciais Inválidas",
      "Usuário Não Encontrado",
    ];
    if (msg.some((m) => error.message.includes(m)))
      return res
        .status(422)
        .json(handleErrors({ code: -11000 }, error.message));

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
