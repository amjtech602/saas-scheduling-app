import { Client } from "@/src/domain/entities/Client";

export interface ClientRepository {
    getAll(): Promise<Client[]>;
    create(client: Client): Promise<Client>;
}