import { CreateServiceDTO } from "@/src/domain/dto/CreateServiceDTO";
import { ServiceRepository } from "@/src/infra/repositories/ServiceRepository";

export class UpdateService {
    constructor(private repository: ServiceRepository) { }

    async execute(service: CreateServiceDTO) {
        return this.repository.update(service);
    }
}