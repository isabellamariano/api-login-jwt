import { loginRequest } from "../interfaces/auth.interface";
import { userLoginResponse } from "../interfaces/user.interface";

export async function checkUser(
  param: loginRequest,
): Promise<userLoginResponse> {
  if (param.usuario === "tester" && param.senha === "12345") {
    return {
      user: {
        id: "234DDDs3###",
        usuario: "tester",
        situacao: "ativo",
      },
      status: true,
      status_descricao: "Deu certo!",
    };
  }

  return {
    status: false,
    status_descricao: "Credenciais inválidas",
  };
}

export async function findById(id: string): Promise<userLoginResponse> {
  if (id === "234DDDs3###") {
    return {
      user: {
        id: "234DDDs3###",
        usuario: "tester",
        situacao: "ativo",
      },
      status: true,
      status_descricao: "Deu certo!",
    };
  }

  return {
    status: false,
    status_descricao: "Credenciais inválidas",
  };
}
