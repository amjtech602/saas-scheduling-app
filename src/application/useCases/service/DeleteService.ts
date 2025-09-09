import { ServiceRepository } from "@/src/infra/repositories/ServiceRepository";

export class DeleteService {
    constructor(private repository: ServiceRepository) {}

    async execute(id: number): Promise<void> {
        return this.repository.delete(id);
    }
}