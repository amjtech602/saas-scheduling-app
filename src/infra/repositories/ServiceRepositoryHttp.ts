import { CreateServiceDTO } from "@/src/domain/dto/ServiceDTO";
import { Service } from "@/src/domain/entities/Service";
import axios from "axios";
import { ServiceRepository } from "./ServiceRepository";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true
});


export class ServiceRepositoryHttp implements ServiceRepository {

    async getAll(): Promise<Service[]> {
        const response = await api.get('/services');
        return response.data;
    }

    async create(service: CreateServiceDTO): Promise<Service> {
        const response = await api.post('/services', service);
        return response.data;
    }

}

