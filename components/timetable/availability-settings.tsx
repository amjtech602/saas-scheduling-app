"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Clock, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

interface TimeSlot {
  start: string
  end: string
}

interface DayAvailability {
  isAvailable: boolean
  timeSlots: TimeSlot[]
}

interface WeeklyAvailability {
  [key: string]: DayAvailability
}

const DAYS = [
  { key: "monday", label: "Segunda" },
  { key: "tuesday", label: "Terça" },
  { key: "wednesday", label: "Quarta" },
  { key: "thursday", label: "Quinta" },
  { key: "friday", label: "Sexta" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
]

const timezoneOptions = [
  { value: "America/Noronha", label: "UTC-02:00 - Fernando de Noronha" },
  { value: "America/Sao_Paulo", label: "UTC-03:00 - Horário de Brasília" },
  { value: "America/Belem", label: "UTC-03:00 - Pará e Amapá" },
  { value: "America/Fortaleza", label: "UTC-03:00 - Ceará" },
  { value: "America/Recife", label: "UTC-03:00 - Pernambuco" },
  { value: "America/Maceio", label: "UTC-03:00 - Alagoas" },
  { value: "America/Bahia", label: "UTC-03:00 - Bahia" },
  { value: "America/Araguaina", label: "UTC-03:00 - Tocantins" },
  { value: "America/Cuiaba", label: "UTC-04:00 - Mato Grosso" },
  { value: "America/Campo_Grande", label: "UTC-04:00 - Mato Grosso do Sul" },
  { value: "America/Porto_Velho", label: "UTC-04:00 - Rondônia" },
  { value: "America/Boa_Vista", label: "UTC-04:00 - Roraima" },
  { value: "America/Manaus", label: "UTC-04:00 - Amazonas (maior parte)" },
  { value: "America/Rio_Branco", label: "UTC-05:00 - Acre" },
  { value: "America/Eirunepe", label: "UTC-05:00 - Amazonas (sudoeste)" }
];


const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2)
  const minute = i % 2 === 0 ? "00" : "30"
  const time24 = `${hour.toString().padStart(2, "0")}:${minute}`
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  const ampm = hour < 12 ? "AM" : "PM"
  // const time12 = `${hour12}:${minute} ${ampm}`
  return { value: time24, label: time24 }
})

export function AvailabilitySettings() {
  const [availability, setAvailability] = useState<WeeklyAvailability>({
    monday: { isAvailable: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    tuesday: { isAvailable: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    wednesday: { isAvailable: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    thursday: { isAvailable: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    friday: { isAvailable: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    saturday: { isAvailable: false, timeSlots: [] },
    sunday: { isAvailable: false, timeSlots: [] },
  })

  const [bufferTime, setBufferTime] = useState(15)
  const [timezone, setTimezone] = useState("America/Sao_Paulo")

  const toggleDayAvailability = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isAvailable: !prev[day].isAvailable,
        timeSlots: !prev[day].isAvailable ? [{ start: "09:00", end: "17:00" }] : [],
      },
    }))
  }

  const addTimeSlot = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: [...prev[day].timeSlots, { start: "09:00", end: "17:00" }],
      },
    }))
  }

  const removeTimeSlot = (day: string, index: number) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.filter((_, i) => i !== index),
      },
    }))
  }

  const updateTimeSlot = (day: string, index: number, field: "start" | "end", value: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)),
      },
    }))
  }

  const copyToAllDays = (sourceDay: string) => {
    const sourceAvailability = availability[sourceDay]
    const newAvailability = { ...availability }

    DAYS.forEach(({ key }) => {
      if (key !== sourceDay) {
        newAvailability[key] = {
          isAvailable: sourceAvailability.isAvailable,
          timeSlots: sourceAvailability.timeSlots.map((slot) => ({ ...slot })),
        }
      }
    })

    setAvailability(newAvailability)
  }

  const formatTime = (time24: string) => {
    const option = TIME_OPTIONS.find((opt) => opt.value === time24)
    return option ? option.label : time24
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Configurações de disponibilidade</h2>
          <p className="text-gray-600">Configure seu horário de trabalho e disponibilidade</p>
        </div>
        <Button>Salvar alterações</Button>
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações globais</CardTitle>
          <CardDescription>Configurações que se aplicam a todos os compromissos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buffer-time">Intervalo entre atendimentos</Label>
              <Select value={bufferTime.toString()} onValueChange={(value) => setBufferTime(Number.parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sem intervalo</SelectItem>
                  <SelectItem value="5">5 minutos</SelectItem>
                  <SelectItem value="10">10 minutos</SelectItem>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Fuso horário</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezoneOptions.map(tz => (
                    <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Availability */}
      <Card>
        <CardHeader>
          <CardTitle>Disponibilidade Semanal</CardTitle>
          <CardDescription>Defina seus horários disponíveis para cada dia da semana</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {DAYS.map(({ key, label }) => (
            <div key={key} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Switch className="cursor-pointer" checked={availability[key].isAvailable} onCheckedChange={() => toggleDayAvailability(key)} />
                  <Label className="text-base font-medium">{label}</Label>
                  {availability[key].isAvailable && (
                    <Badge variant="secondary" className="text-xs">
                      {availability[key].timeSlots.length} período{availability[key].timeSlots.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
                {availability[key].isAvailable && (
                  <div className="flex space-x-2">
                    <Button className="cursor-pointer" variant="outline" size="sm" onClick={() => addTimeSlot(key)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar Período Disponível
                    </Button>
                    <Button className="cursor-pointer" variant="outline" size="sm" onClick={() => copyToAllDays(key)}>
                      Copiar para todos
                    </Button>
                  </div>
                )}
              </div>

              {availability[key].isAvailable && (
                <div className="ml-8 space-y-3">
                  {availability[key].timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div className="flex items-center space-x-2">
                        <Select
                          value={slot.start}
                          onValueChange={(value) => updateTimeSlot(key, index, "start", value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_OPTIONS.map((time) => (
                              <SelectItem key={time.value} value={time.value}>
                                {time.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-gray-500">to</span>
                        <Select value={slot.end} onValueChange={(value) => updateTimeSlot(key, index, "end", value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_OPTIONS.map((time) => (
                              <SelectItem key={time.value} value={time.value}>
                                {time.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 text-sm text-gray-600">
                        {formatTime(slot.start)} - {formatTime(slot.end)}
                      </div>
                      {availability[key].timeSlots.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTimeSlot(key, index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!availability[key].isAvailable && (
                <div className="ml-8 text-sm text-gray-500 italic">Não disponível em {label.toLowerCase()}</div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
