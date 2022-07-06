
export class Pageable {
    public currentPage: number;
    public maxPerPage: number;
    public totalItemsCount: number;

    constructor(maxPerPage = 100, 
                currentPage = 1, 
                totalItemsCount = 0) {
        this.maxPerPage = maxPerPage;
        this.currentPage = currentPage;
        this.totalItemsCount = totalItemsCount;
    }

    public get totalPages() {
        return Math.ceil(this.totalItemsCount / this.maxPerPage)
    }

    public get isLastPage() {
        return this.currentPage === this.totalPages;
    }
}