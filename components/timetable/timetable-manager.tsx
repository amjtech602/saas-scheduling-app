"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AvailabilitySettings } from "./availability-settings"
import { BlockedTimes } from "./blocked-times"

export function TimetableManager() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuração de Horário de Atendimento</h1>
        <p className="text-gray-600 mt-2">Gerencie sua disponibilidade, horário de trabalho e horários bloqueados</p>
      </div>

      <Tabs defaultValue="availability" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="availability">Disponibilidade</TabsTrigger>
          <TabsTrigger value="blocked-times">Horários bloqueados</TabsTrigger>
        </TabsList>

        <TabsContent value="availability" className="mt-6">
          <AvailabilitySettings />
        </TabsContent>

        <TabsContent value="blocked-times" className="mt-6">
          <BlockedTimes />
        </TabsContent>
      </Tabs>
    </div>
  )
}
