import { Category } from "@/src/domain/entities/Category";

export interface CategoryRepository {
    getAll(): Promise<Category[]>;
    create(name: string): Promise<Category>; 
}