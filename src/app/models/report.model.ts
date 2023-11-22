import { IUserDTO } from "./user.model";

export interface IReportDTO {
    id: string,
    client?: string,
    salesPerson?: string | IUserDTO,
    picture?: boolean,
    paid?: number,
    positive?: boolean,
    rating?: number,
    submitted?: string,
    platform?: string,
    store: string,
};
