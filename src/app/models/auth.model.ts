import { IUserDTO } from "./user.model"

export interface ITokens {
    token: string,
    expires: string,
}

export interface ITokenTypes {
    access: ITokens,
    refresh: ITokens
}

export class ITokensDTO {
    tokens!: ITokenTypes
}

export interface IAuthDTO {
    data: {
        tokens: ITokenTypes,
        user: IUserDTO
    }
}