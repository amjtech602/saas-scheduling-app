import { ClientRepository } from "@/src/infra/repositories/client/ClientRepository";

export class GetClients {
    constructor(private repository: ClientRepository) {}

    async execute() {
        return await this.repository.getAll();
    }
}