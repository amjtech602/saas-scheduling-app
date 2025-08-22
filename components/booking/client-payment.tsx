"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Lock, Shield, Clock } from "lucide-react"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
}

interface PaymentData {
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  cvc: string
  cardholderName: string
  billingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

interface ClientPaymentProps {
  service: Service
  onNext: (data: { paymentData: PaymentData }) => void
  onBack: () => void
  onPayLater?: () => void
  canGoBack: boolean
}

export function ClientPayment({ service, onNext, onBack, onPayLater, canGoBack }: ClientPaymentProps) {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
    cardholderName: "",
    billingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
    },
  })
  const [processing, setProcessing] = useState(false)

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

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setPaymentData((prev) => ({ ...prev, cardNumber: formatted }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    // Mock payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setProcessing(false)
    onNext({ paymentData })
  }

  const isFormValid = () => {
    return (
      paymentData.cardNumber.replace(/\s/g, "").length >= 16 &&
      paymentData.expiryMonth &&
      paymentData.expiryYear &&
      paymentData.cvc.length >= 3 &&
      paymentData.cardholderName.trim() &&
      paymentData.billingAddress.street.trim() &&
      paymentData.billingAddress.city.trim() &&
      paymentData.billingAddress.state.trim() &&
      paymentData.billingAddress.zipCode.trim()
    )
  }

  const tax = service.price * 0.08 // 8% tax
  const total = service.price + tax

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{service.name}</h3>
              <p className="text-sm text-gray-600">{service.duration} minutes</p>
            </div>
            <div className="text-right">
              <p className="font-medium">${service.price}</p>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${service.price}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pay Later Option Card */}
      {onPayLater && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <Clock className="w-5 h-5" />
              <span>Pay After Service</span>
            </CardTitle>
            <CardDescription className="text-orange-700">
              Book now and pay after your appointment is completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <p className="text-sm text-orange-800">No payment required upfront</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <p className="text-sm text-orange-800">Secure payment link sent after service completion</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <p className="text-sm text-orange-800">Payment due within 24 hours of service</p>
              </div>
            </div>
            <Button
              onClick={onPayLater}
              variant="outline"
              className="w-full mt-4 border-orange-300 text-orange-800 hover:bg-orange-100 bg-transparent"
            >
              <Clock className="w-4 h-4 mr-2" />
              Book Now, Pay Later
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Payment Information</span>
          </CardTitle>
          <CardDescription>Enter your payment details to complete the booking</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Card Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  placeholder="John Doe"
                  value={paymentData.cardholderName}
                  onChange={(e) => setPaymentData((prev) => ({ ...prev, cardholderName: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryMonth">Month</Label>
                  <Select
                    value={paymentData.expiryMonth}
                    onValueChange={(value) => setPaymentData((prev) => ({ ...prev, expiryMonth: value }))}
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
                    value={paymentData.expiryYear}
                    onValueChange={(value) => setPaymentData((prev) => ({ ...prev, expiryYear: value }))}
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
                    value={paymentData.cvc}
                    onChange={(e) =>
                      setPaymentData((prev) => ({
                        ...prev,
                        cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                      }))
                    }
                    maxLength={4}
                    required
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Billing Address */}
            <div className="space-y-4">
              <h3 className="font-medium">Billing Address</h3>

              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  placeholder="123 Main St"
                  value={paymentData.billingAddress.street}
                  onChange={(e) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      billingAddress: { ...prev.billingAddress, street: e.target.value },
                    }))
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    value={paymentData.billingAddress.city}
                    onChange={(e) =>
                      setPaymentData((prev) => ({
                        ...prev,
                        billingAddress: { ...prev.billingAddress, city: e.target.value },
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="NY"
                    value={paymentData.billingAddress.state}
                    onChange={(e) =>
                      setPaymentData((prev) => ({
                        ...prev,
                        billingAddress: { ...prev.billingAddress, state: e.target.value },
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    placeholder="10001"
                    value={paymentData.billingAddress.zipCode}
                    onChange={(e) =>
                      setPaymentData((prev) => ({
                        ...prev,
                        billingAddress: { ...prev.billingAddress, zipCode: e.target.value },
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={paymentData.billingAddress.country}
                    onValueChange={(value) =>
                      setPaymentData((prev) => ({
                        ...prev,
                        billingAddress: { ...prev.billingAddress, country: value },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <Shield className="w-4 h-4" />
              <span>Your payment information is secure and encrypted with 256-bit SSL</span>
            </div>

            <div className="flex space-x-3 pt-4">
              {canGoBack && (
                <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
                  Back
                </Button>
              )}
              <Button type="submit" disabled={!isFormValid() || processing} className="flex-1">
                {processing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Pay ${total.toFixed(2)}</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
