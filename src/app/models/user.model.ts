import { ITokensDTO } from "./auth.model"

export enum Roles {
    USER = 'user',
    ADMIN = 'admin',
}

export type TRole = Roles.ADMIN | Roles.USER;

export interface IUserDTO extends ITokensDTO {
    id: string;
    name: string;
    email: string;
    role: TRole;
    isEmailVerified?: false
};

export interface IUsedInDTO {
    usedIn: number;
}
