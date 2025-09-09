import { Category } from "@/src/domain/entities/Category";
import { CategoryRepository } from "@/src/infra/repositories/category/CategoryRepository";

export class CreateCategory {
    constructor(private repository: CategoryRepository) {}

    async execute(category: Category) {
        return await this.repository.create(category);
    }
}