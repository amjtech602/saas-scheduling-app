import { CreateServiceDTO } from "@/src/domain/dto/CreateServiceDTO";
import { ServiceRepository } from "@/src/infra/repositories/service/ServiceRepository";

export class UpdateService {
    constructor(private repository: ServiceRepository) { }

    async execute(service: CreateServiceDTO) {
        return await this.repository.update(service);
    }
}