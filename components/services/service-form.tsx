"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { GetCategories } from "@/src/application/useCases/category/GetCategories"
import { CreateServiceDTO } from "@/src/domain/dto/CreateServiceDTO"
import { Category } from "@/src/domain/entities/Category"
import { CategoryRepositoryHttps } from "@/src/infra/repositories/category/CategoryRepositoryHttps"
import { X } from "lucide-react"
import { useEffect, useState } from "react"


interface ServiceFormProps {
  service?: CreateServiceDTO
  onSave: (service: CreateServiceDTO) => void
  onCancel: () => void
}

export function ServiceForm({ service, onSave, onCancel }: ServiceFormProps) {

  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<CreateServiceDTO>({
    name: service?.name || "",
    description: service?.description || "",
    price: service?.price || 0,
    duration: service?.duration || 60,
    currency: service?.currency || "BRL",
    categoryId: service?.categoryId || "0",
    requiresPreparation: service?.requiresPreparation || false,
    preparationTime: service?.preparationTime || 0,
    maxBookingsPerDay: service?.maxBookingsPerDay ||1,
    bufferTime: service?.bufferTime || 0,
    isActive: service?.isActive || true,
    maxAdvanceBooking: service?.maxAdvanceBooking || 0
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const repo = new CategoryRepositoryHttps();
      const getCategories = new GetCategories(repo);
      const data = await getCategories.execute();
      setCategories(data);
    } catch(error) {
      console.log(error)
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  }

  const handleInputChange = (field: keyof CreateServiceDTO, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{service ? "Editar Serviço" : "Adicionar Novo Serviço"}</CardTitle>
            <CardDescription>
              {service ? "Atualize os detalhes do seu serviço" : "Crie uma nova oferta de serviço"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Serviço</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="ex. Consulta Empresarial"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descreva o que este serviço inclui..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duração (minutos)</Label>
                <Select
                  value={formData.duration.toString()}
                  onValueChange={(value) => handleInputChange("duration", Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="45">45 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="90">1.5 hora</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                    <SelectItem value="180">3 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={formData.categoryId} onValueChange={(value) => handleInputChange("categoryId", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                  ))}
                  
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Configurações Avançadas</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ativar Serviço</Label>
                <p className="text-sm text-muted-foreground">Permitir que os clientes reservem este serviço</p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange("isActive", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Requer preparação</Label>
                <p className="text-sm text-muted-foreground">Você precisa de tempo para se preparar antes deste serviço</p>
              </div>
              <Switch
                checked={formData.requiresPreparation}
                onCheckedChange={(checked) => handleInputChange("requiresPreparation", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxAdvanceBooking">Reserva Antecipada Máxima (dias)</Label>
              <Select
                value={formData.maxAdvanceBooking.toString()}
                onValueChange={(value) => handleInputChange("maxAdvanceBooking", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">1 semana</SelectItem>
                  <SelectItem value="14">2 semanas</SelectItem>
                  <SelectItem value="30">1 mês</SelectItem>
                  <SelectItem value="60">2 meses</SelectItem>
                  <SelectItem value="90">3 meses</SelectItem>
                  <SelectItem value="180">6 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">{service ? "Atualizar Serviço" : "Criar Serviço"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
