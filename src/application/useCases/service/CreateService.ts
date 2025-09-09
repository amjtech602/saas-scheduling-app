import { CreateServiceDTO } from "@/src/domain/dto/CreateServiceDTO";
import { Service } from "@/src/domain/entities/Service";
import { ServiceRepository } from "@/src/infra/repositories/service/ServiceRepository";

export class CreateService {
    constructor(private repository: ServiceRepository) {}

    async execute(data: CreateServiceDTO): Promise<Service> {
        return await this.repository.create(data);
    }
}