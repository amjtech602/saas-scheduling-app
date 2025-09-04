import { Service } from "@/src/domain/Service";
import { ServiceRepositoryHttp } from "@/src/infra/repositories/ServiceRepositoryHttp";

export class GetServices {
    constructor(private repository: ServiceRepositoryHttp) {}

    async execute(): Promise<Service[]> {
        return this.repository.getAll();
    }
}