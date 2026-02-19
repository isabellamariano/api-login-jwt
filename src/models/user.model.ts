import usersRaw from "../data/usersDummy.json";
import { loginRequest } from "../interfaces/auth.interface";
import { User, userResponse } from "../interfaces/user.interface";

const users = usersRaw.usuarios as User[];

export async function checkUser(
  param: loginRequest,
): Promise<userResponse> {

  const response = users.find(f => f.usuario === param.usuario && f.senha === param.senha);

  if (response && response.status === "active") {
    return {
      user: response,
      status: true,
      status_descricao: "Deu certo!",
    };
  }

  return {
    status: false,
    status_descricao: "Credenciais Inválidas",
  };
}

export async function findById(id: number): Promise<userResponse> {
  const response = users.find((u) => u.id === id);
  if (response) {
    return {
      user: response,
      status: true,
      status_descricao: "Deu certo!",
    };
  }

  return {
    status: false,
    status_descricao: "Credenciais Inválidas",
  };
}
