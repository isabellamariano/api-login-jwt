export interface jwtPayload {
    id: number;
    usuario: string;
    roles?: string[];
}