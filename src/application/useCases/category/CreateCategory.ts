import { CategoryRepository } from "@/src/infra/repositories/category/CategoryRepository";

export class CreateCategory {
    constructor(private repository: CategoryRepository) {}

    async execute(name: string) {
        return await this.repository.create(name);
    }
}