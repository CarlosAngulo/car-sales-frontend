import { ITokensDTO } from "./auth.model"

export class IUserDTO extends ITokensDTO {
    id!: string;
    name!: string;
    email!: string;
    role!: 'user' | 'admin';
    isEmailVerified?: false
};