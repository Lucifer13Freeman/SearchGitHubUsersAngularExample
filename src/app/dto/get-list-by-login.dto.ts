export class GetListByLoginDto {
    readonly login!: string;
    readonly perPage?: number = 100;
    readonly page?: number = 1;
}