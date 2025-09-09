import { Category } from "@/src/domain/entities/Category";

export interface CategoryRepository {
    getAll(): Promise<Category[]>;
    create(category: Category): Promise<Category>; 
}