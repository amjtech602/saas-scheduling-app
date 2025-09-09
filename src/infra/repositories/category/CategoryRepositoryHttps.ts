import { Category } from "@/src/domain/entities/Category";
import axios from "axios";
import { CategoryRepository } from "./CategoryRepository";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true
});

export class CategoryRepositoryHttps implements CategoryRepository {

    async getAll(): Promise<Category[]> {
        const response = await api.get('categories');
        return response.data;
    }
    async create(category: Category): Promise<Category> {
        const response = await api.post('categories', {name: category.name});
        return response.data;
    }

}