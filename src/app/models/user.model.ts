export interface ITokens {
    token: string,
    expires: string,
}

export interface IUserDTO {
    id: string,
    name: string,
    email: string,
    role: 'user' | 'admin',
    isEmailVerified?: false,
    tokens?: {
        access: ITokens,
        refresh: ITokens
    }
};