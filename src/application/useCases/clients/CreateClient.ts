import { Client } from "@/src/domain/entities/Client";
import { ClientRepository } from "@/src/infra/repositories/client/ClientRepository";

export class CreateClient {
    constructor(private repository: ClientRepository) {}

    async execute(client: Client) {
        return await this.repository.create(client);
    }
}