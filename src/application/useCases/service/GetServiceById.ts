import { Service } from "@/src/domain/entities/Service";
import { ServiceRepositoryHttp } from "@/src/infra/repositories/service/ServiceRepositoryHttp";

export class GetServiceById {
    constructor(private repository: ServiceRepositoryHttp) {}

    async execute(id: number): Promise<Service> {
        return await this.repository.getById(id);
    }
}