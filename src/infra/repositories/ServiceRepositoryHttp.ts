import { Service } from "@/src/domain/Service";
import axios from "axios";

export class ServiceRepositoryHttp {
    async getAll(): Promise<Service[]> {
       // const { data } = await axios.get<Service[]>("/api/services", { withCredentials: true });
         const { data } = await axios.get<Service[]>(`${process.env.NEXT_PUBLIC_API_URL}/services`, { withCredentials: true });// backend eterno
        return data;
    }
}