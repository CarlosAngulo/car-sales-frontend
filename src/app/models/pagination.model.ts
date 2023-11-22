export interface IPaginationMeta {
    limit: number;
    page: number;
    totalPages: number;
    totalResults?: number;
}

export interface IPaginationDTO<T> extends IPaginationMeta {
    results: T[]
}