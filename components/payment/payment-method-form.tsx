"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Lock } from "lucide-react"
import { usePayment } from "./payment-context"

interface PaymentMethodFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function PaymentMethodForm({ onSuccess, onCancel }: PaymentMethodFormProps) {
  const { addPaymentMethod, loading } = usePayment()
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
    name: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mock card validation
    if (formData.cardNumber.length < 16) {
      alert("Please enter a valid card number")
      return
    }

    try {
      await addPaymentMethod({
        type: "card",
        last4: formData.cardNumber.slice(-4),
        brand: "visa", // Mock brand detection
        expiryMonth: Number.parseInt(formData.expiryMonth),
        expiryYear: Number.parseInt(formData.expiryYear),
      })

      onSuccess?.()
    } catch (error) {
      console.error("Failed to add payment method:", error)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>Add Payment Method</span>
        </CardTitle>
        <CardDescription>Add a credit or debit card to your account</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Cardholder Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  cardNumber: formatCardNumber(e.target.value),
                }))
              }
              maxLength={19}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryMonth">Month</Label>
              <Select
                value={formData.expiryMonth}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, expiryMonth: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <SelectItem key={month} value={month.toString().padStart(2, "0")}>
                      {month.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryYear">Year</Label>
              <Select
                value={formData.expiryYear}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, expiryYear: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="YY" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year.toString().slice(-2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                value={formData.cvc}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                  }))
                }
                maxLength={4}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>

          <div className="flex space-x-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Adding..." : "Add Payment Method"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
