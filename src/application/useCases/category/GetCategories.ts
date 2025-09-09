import { CategoryRepository } from "@/src/infra/repositories/category/CategoryRepository";

export class GetCategories {
    constructor(private repository: CategoryRepository) {}

    async execute() {
        return this.repository.getAll();
    }
}