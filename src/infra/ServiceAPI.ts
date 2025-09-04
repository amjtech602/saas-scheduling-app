import { Service } from "../domain/Service";

const VERSAO = process.env.VERSAO;
const BASE_URL = `${process.env.API_URL}${VERSAO}`;

export const ServiceAPI = {
    async list(): Promise<Service[]> {
        const res = await fetch(`https://anotadoai.com.br/agendei-api/v1/services`, {
            credentials: 'include' // Sends cookies and other credentials with the request
        });
        console.log(res)
        return [];
        // if (!res.ok) throw new Error("Erro ao listar serviços");
        // const data = await res.json();
        // return data?.map((s: any) => ({ ...s, price: parseFloat(s.price) })) || [];
    }
}