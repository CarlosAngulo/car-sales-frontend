export interface IPaginationDTO<T> {
    limit: number,
    page: number,
    totalPages: number,
    totalresults: number,
    results: T[]
}