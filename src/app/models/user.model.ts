import { ITokensDTO } from "./auth.model"

export interface IUserDTO extends ITokensDTO {
    id: string,
    name: string,
    email: string,
    role: 'user' | 'admin',
    isEmailVerified?: false
};