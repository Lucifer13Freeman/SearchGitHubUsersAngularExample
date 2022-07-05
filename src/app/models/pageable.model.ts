import { IPageable } from "../interfaces/pageable.interface";

export class Pageable implements IPageable
{
    currentPage: number;
    maxPerPage: number;
    totalItemsCount: number;
    totalPages?: number;

    constructor(maxPerPage = 100, 
                currentPage = 1, 
                totalItemsCount = 0) 
    {
        this.maxPerPage = maxPerPage;
        this.currentPage = currentPage;
        this.totalItemsCount = totalItemsCount;
    }
}