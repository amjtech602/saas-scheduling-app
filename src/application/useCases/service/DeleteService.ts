import { ServiceRepository } from "@/src/infra/repositories/service/ServiceRepository";

export class DeleteService {
    constructor(private repository: ServiceRepository) {}

    async execute(id: number): Promise<void> {
        return this.repository.delete(id);
    }
}