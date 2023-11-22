export interface ITokens {
    token: string,
    expires: string,
}

export interface ITokenTypes {
    access: ITokens,
    refresh: ITokens
}

export interface ITokensDTO {
    tokens: ITokenTypes
}