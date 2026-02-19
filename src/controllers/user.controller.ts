import { Request, Response } from "express";
import { Controller, Get, Path, Response as respTSOA, Route, Security, Tags } from "tsoa";
import { handleErrors } from "../config/utils";
import { userResponse } from "../interfaces/user.interface";
import * as userSRVC from "../services/user.service";

@Route("user")
@Tags("User")
export class UserDocController extends Controller {
    @Security("bearerAuth")
    @respTSOA(500, "Erro Interno")
    @Get("{id}")
    public async getUserById(@Path() id: number): Promise<userResponse> {
        return {} as any;
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.query.id || req.params.id);
        const resp = await userSRVC.getUserById(id);

        return res.json(resp);
    } catch (error: any) {
        return res.status(500).json(handleErrors(error));
    }
};