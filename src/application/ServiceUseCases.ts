import { Service } from "../domain/entities/Service";
import { ServiceAPI } from "../infra/ServiceAPI";

export async function listServices(): Promise<Service[]> {
    return ServiceAPI.list();
}