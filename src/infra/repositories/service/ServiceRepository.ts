import { CreateServiceDTO } from "@/src/domain/dto/CreateServiceDTO";
import { Service } from "@/src/domain/entities/Service";

export interface ServiceRepository {
    create(service: CreateServiceDTO): Promise<Service>;
    getAll(): Promise<Service[]>;
    getById(id: number): Promise<Service>;
    update(service: CreateServiceDTO): Promise<Service>;
    delete(serviceId: number): void;
}