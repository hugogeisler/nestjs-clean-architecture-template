export interface IUUID {
    generate(): string;
    validate(id: string): boolean;
}
