import { Client } from "@/src/domain/entities/Client";
import axios from "axios";
import { ClientRepository } from "./ClientRepository";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true
});
export class ClientRepositoryHttps implements ClientRepository {
    async getAll(): Promise<Client[]> {
        const response = await api.get('clients');
        return response.data;
    }
    async create(client: Client): Promise<Client> {
        const response = await api.post('clients', client);
        return response.data;
    }
    
}