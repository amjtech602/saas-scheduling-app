import { CreateServiceDTO } from "@/src/domain/dto/ServiceDTO";
import { Service } from "@/src/domain/entities/Service";

export interface ServiceRepository {
    getAll(): Promise<Service[]>;
    create(service: CreateServiceDTO): Promise<Service>;
}