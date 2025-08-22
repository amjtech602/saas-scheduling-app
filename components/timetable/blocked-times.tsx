"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash2, Clock, X } from "lucide-react"
import { format } from "date-fns"

interface BlockedTime {
  id: string
  title: string
  description?: string
  date: Date
  startTime: string
  endTime: string
  type: "break" | "personal" | "maintenance" | "other"
  isRecurring: boolean
  recurringPattern?: "daily" | "weekly" | "monthly"
}

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2)
  const minute = i % 2 === 0 ? "00" : "30"
  const time24 = `${hour.toString().padStart(2, "0")}:${minute}`
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  const ampm = hour < 12 ? "AM" : "PM"
  const time12 = `${hour12}:${minute} ${ampm}`
  return { value: time24, label: time12 }
})

const BLOCK_TYPES = [
  { value: "break", label: "Break", color: "bg-yellow-100 text-yellow-800" },
  { value: "personal", label: "Personal", color: "bg-blue-100 text-blue-800" },
  { value: "maintenance", label: "Maintenance", color: "bg-gray-100 text-gray-800" },
  { value: "other", label: "Other", color: "bg-purple-100 text-purple-800" },
]

export function BlockedTimes() {
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([
    {
      id: "1",
      title: "Lunch Break",
      description: "Daily lunch break",
      date: new Date(),
      startTime: "12:00",
      endTime: "13:00",
      type: "break",
      isRecurring: true,
      recurringPattern: "daily",
    },
    {
      id: "2",
      title: "Doctor Appointment",
      date: new Date(Date.now() + 86400000), // Tomorrow
      startTime: "14:00",
      endTime: "15:30",
      type: "personal",
      isRecurring: false,
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingBlock, setEditingBlock] = useState<BlockedTime | null>(null)
  const [formData, setFormData] = useState<Partial<BlockedTime>>({
    title: "",
    description: "",
    date: new Date(),
    startTime: "09:00",
    endTime: "10:00",
    type: "break",
    isRecurring: false,
  })

  const handleSaveBlock = () => {
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) return

    const blockData: BlockedTime = {
      id: editingBlock?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      type: formData.type as BlockedTime["type"],
      isRecurring: formData.isRecurring || false,
      recurringPattern: formData.recurringPattern,
    }

    if (editingBlock) {
      setBlockedTimes((prev) => prev.map((block) => (block.id === editingBlock.id ? blockData : block)))
    } else {
      setBlockedTimes((prev) => [...prev, blockData])
    }

    resetForm()
  }

  const handleEditBlock = (block: BlockedTime) => {
    setEditingBlock(block)
    setFormData(block)
    setShowForm(true)
  }

  const handleDeleteBlock = (blockId: string) => {
    setBlockedTimes((prev) => prev.filter((block) => block.id !== blockId))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: new Date(),
      startTime: "09:00",
      endTime: "10:00",
      type: "break",
      isRecurring: false,
    })
    setEditingBlock(null)
    setShowForm(false)
  }

  const getTypeConfig = (type: string) => {
    return BLOCK_TYPES.find((t) => t.value === type) || BLOCK_TYPES[0]
  }

  const formatTime = (time24: string) => {
    const option = TIME_OPTIONS.find((opt) => opt.value === time24)
    return option ? option.label : time24
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Blocked Times</h2>
          <p className="text-gray-600">Manage breaks, personal time, and unavailable periods</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Block Time
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{editingBlock ? "Edit Blocked Time" : "Block New Time"}</CardTitle>
                <CardDescription>
                  {editingBlock ? "Update blocked time details" : "Create a new blocked time period"}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Lunch Break"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as BlockedTime["type"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOCK_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Additional details..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => setFormData({ ...formData, date: date || new Date() })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Select
                  value={formData.startTime}
                  onValueChange={(value) => setFormData({ ...formData, startTime: value })}
                >
                  <SelectTrigger>
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

              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Select
                  value={formData.endTime}
                  onValueChange={(value) => setFormData({ ...formData, endTime: value })}
                >
                  <SelectTrigger>
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
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleSaveBlock}>{editingBlock ? "Update" : "Create"} Block</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blocked Times List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Blocked Times</CardTitle>
          <CardDescription>Your scheduled breaks and unavailable periods</CardDescription>
        </CardHeader>
        <CardContent>
          {blockedTimes.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blocked times</h3>
              <p className="text-gray-500 mb-4">You haven't blocked any time periods yet</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Block Your First Time
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {blockedTimes.map((block) => {
                const typeConfig = getTypeConfig(block.type)
                return (
                  <div key={block.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center text-sm">
                        <span className="font-medium">{format(block.date, "MMM")}</span>
                        <span className="text-2xl font-bold">{format(block.date, "d")}</span>
                        <span className="text-gray-500">{format(block.date, "EEE")}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium">{block.title}</h3>
                          <Badge className={typeConfig.color}>{typeConfig.label}</Badge>
                          {block.isRecurring && (
                            <Badge variant="outline" className="text-xs">
                              Recurring {block.recurringPattern}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {formatTime(block.startTime)} - {formatTime(block.endTime)}
                        </p>
                        {block.description && <p className="text-sm text-gray-500">{block.description}</p>}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditBlock(block)}>
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBlock(block.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
