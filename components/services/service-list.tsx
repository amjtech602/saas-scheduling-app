"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateService } from "@/src/application/useCases/service/CreateService"
import { DeleteService } from "@/src/application/useCases/service/DeleteService"
import { GetServices } from "@/src/application/useCases/service/GetServices"
import { UpdateService } from "@/src/application/useCases/service/UpdateService"
import { CreateServiceDTO } from "@/src/domain/dto/CreateServiceDTO"
import { Service } from "@/src/domain/entities/Service"
import { ServiceRepositoryHttp } from "@/src/infra/repositories/service/ServiceRepositoryHttp"
import { Copy, Edit, Eye, EyeOff, MoreHorizontal, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { ServiceForm } from "./service-form"


export function ServiceList() {

    const [services, setServices] = useState<Service[]>([])
    const [editingService, setEditingService] = useState<CreateServiceDTO | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(true);

    const repo = new ServiceRepositoryHttp();

    useEffect(() => {
        fetchServices();
    }, []);


    const fetchServices = async () => {
        try {
            const getServices = new GetServices(repo);
            const data = await getServices.execute();
            setServices(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }


    const handleSaveService = async (serviceData: CreateServiceDTO) => {
        
        try {
            if (editingService) {
                const useCase = new UpdateService(repo);
                await useCase.execute({...serviceData, id: editingService.id});
            } else {
                const useCase = new CreateService(repo);
                useCase.execute(serviceData);
            }
        } catch(error) {
            console.log(error);
            alert("Erro na execução");
        } finally {
            fetchServices();
            setShowForm(false);
        }
    }

    const handleEditService = (service: Service) => {
        const { category, ...serviceDTO } = service;
        // const categoryId = serviceDTO.categoryId.toString();
        const categoryId = "1";
        const id = parseInt(serviceDTO.id);
        setEditingService({ ...serviceDTO, id, categoryId });
        setShowForm(true)
    }

    const handleDeleteService = async (serviceId: number) => {
        const deleteService = new DeleteService(repo);
        await deleteService.execute(serviceId);
        fetchServices();
    }

    const handleToggleActive = (serviceId: string) => {
        setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, isActive: !s.isActive } : s)))
    }

    const handleDuplicateService = (service: Service) => {
        const duplicatedService = {
            ...service,
            id: Date.now().toString(),
            name: `${service.name} (Copy)`,
            bookings: 0,
        }
        setServices((prev) => [...prev, duplicatedService])
    }

    const getCategoryColor = (category: string) => {
        const colors = {
            consulta: "bg-blue-100 text-blue-800",
            treinamento: "bg-green-100 text-green-800",
            terapia: "bg-purple-100 text-purple-800",
            workshop: "bg-pink-100 text-pink-800",
            outra: "bg-gray-100 text-gray-800",
        }
        return colors[category as keyof typeof colors] || colors.outra
    }

    if (loading) return <p>Carregando...</p>;


    if (showForm) {
        return (
            <div className="flex justify-center">
                <ServiceForm
                    service={editingService || undefined}
                    onSave={handleSaveService}
                    onCancel={() => {
                        setShowForm(false)
                        setEditingService(null)
                    }}
                />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Serviços</h2>
                    <p className="text-gray-600">Gerencie suas ofertas de serviços e preços</p>
                </div>
                <Button onClick={() => setShowForm(true)}>Adicionar Serviço</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <Card key={service.id} className={`relative ${!service.isActive ? "opacity-60" : ""}`}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <CardTitle className="text-lg">{service.name}</CardTitle>
                                        {!service.isActive && <EyeOff className="h-4 w-4 text-gray-400" />}
                                    </div>
                                    <Badge className={getCategoryColor(service.category)}>{service.category}</Badge>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEditService(service)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDuplicateService(service)}>
                                            <Copy className="h-4 w-4 mr-2" />
                                            Duplicar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleToggleActive(service.id)}>
                                            {service.isActive ? (
                                                <>
                                                    <EyeOff className="h-4 w-4 mr-2" />
                                                    Desativar
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Ativar
                                                </>
                                            )}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDeleteService(parseInt(service.id))} className="text-red-600">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Deletar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <CardDescription className="text-sm">
                                    {service.description || "Nenhuma descrição fornecida"}
                                </CardDescription>

                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold">R$ {service.price}</span>
                                    <span className="text-sm text-gray-500">{service.duration} min</span>
                                </div>

                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>{0} Reserva(s)</span>
                                    <span>Máx. {service.maxAdvanceBooking} dias de antecedência</span>
                                </div>

                                {service.requiresPreparation && (
                                    <Badge variant="outline" className="text-xs">
                                        Requer preparação
                                    </Badge>
                                )}

                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 bg-transparent"
                                        onClick={() => handleEditService(service)}
                                    >
                                        Editar
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                        Compartilhar Link
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {services.length === 0 && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="text-center space-y-4">
                            <h3 className="text-lg font-medium">Nenhum serviço cadastrado</h3>
                            <p className="text-gray-500">Crie seu primeiro serviço para começar a aceitar reservas!</p>
                            <Button onClick={() => setShowForm(true)}>Adicione seu primeiro serviço</Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
