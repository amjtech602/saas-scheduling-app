import { Service } from "@/src/domain/Service";
import axios from "axios";

export class ServiceRepositoryHttp {
    async getAll(): Promise<Service[]> {
        const { data } = await axios.get<Service[]>("/api/services", { withCredentials: true });
        return data;
    }
}