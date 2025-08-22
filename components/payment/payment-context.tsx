"use client"
import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface PaymentPlan {
  id: string
  name: string
  price: number
  interval: "month" | "year"
  features: string[]
  popular?: boolean
}

export interface Subscription {
  id: string
  planId: string
  status: "active" | "canceled" | "past_due" | "trialing"
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
}

export interface PaymentMethod {
  id: string
  type: "card"
  last4: string
  brand: string
  expiryMonth: number
  expiryYear: number
}

interface PaymentContextType {
  subscription: Subscription | null
  paymentMethods: PaymentMethod[]
  plans: PaymentPlan[]
  loading: boolean
  createSubscription: (planId: string, paymentMethodId: string) => Promise<void>
  cancelSubscription: () => Promise<void>
  addPaymentMethod: (paymentMethod: Omit<PaymentMethod, "id">) => Promise<void>
  removePaymentMethod: (id: string) => Promise<void>
  updateSubscription: (planId: string) => Promise<void>
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined)

const MOCK_PLANS: PaymentPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 15,
    interval: "month",
    features: [
      "Up to 30 bookings/month",
      "Basic calendar integration",
      "Email notifications",
      "Mobile responsive booking page",
      "Basic client management",
      "Standard support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 39,
    interval: "month",
    popular: true,
    features: [
      "Unlimited bookings",
      "Advanced calendar sync (Google, Outlook)",
      "SMS & email notifications",
      "Custom branding & colors",
      "Payment processing integration",
      "Analytics & reporting dashboard",
      "Service packages & pricing tiers",
      "Client history & notes",
      "Automated reminders",
      "Priority support",
    ],
  },
  {
    id: "complete",
    name: "Complete",
    price: 79,
    interval: "month",
    features: [
      "Everything in Professional",
      "Multi-location & team management",
      "Advanced scheduling rules",
      "Custom intake forms",
      "Waitlist management",
      "Recurring appointments",
      "API access & integrations",
      "White-label solution",
      "Advanced analytics & insights",
      "Custom reporting",
      "Dedicated account manager",
      "24/7 priority support",
    ],
  },
]

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock loading subscription data
    const loadPaymentData = async () => {
      setLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock subscription data
      const mockSubscription: Subscription = {
        id: "sub_123",
        planId: "professional",
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false,
      }

      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: "pm_123",
          type: "card",
          last4: "4242",
          brand: "visa",
          expiryMonth: 12,
          expiryYear: 2025,
        },
      ]

      setSubscription(mockSubscription)
      setPaymentMethods(mockPaymentMethods)
      setLoading(false)
    }

    loadPaymentData()
  }, [])

  const createSubscription = async (planId: string, paymentMethodId: string) => {
    setLoading(true)
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newSubscription: Subscription = {
      id: `sub_${Date.now()}`,
      planId,
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
    }

    setSubscription(newSubscription)
    setLoading(false)
  }

  const cancelSubscription = async () => {
    if (!subscription) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSubscription({
      ...subscription,
      cancelAtPeriodEnd: true,
    })
    setLoading(false)
  }

  const addPaymentMethod = async (paymentMethod: Omit<PaymentMethod, "id">) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newPaymentMethod: PaymentMethod = {
      ...paymentMethod,
      id: `pm_${Date.now()}`,
    }

    setPaymentMethods((prev) => [...prev, newPaymentMethod])
    setLoading(false)
  }

  const removePaymentMethod = async (id: string) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id))
    setLoading(false)
  }

  const updateSubscription = async (planId: string) => {
    if (!subscription) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSubscription({
      ...subscription,
      planId,
    })
    setLoading(false)
  }

  return (
    <PaymentContext.Provider
      value={{
        subscription,
        paymentMethods,
        plans: MOCK_PLANS,
        loading,
        createSubscription,
        cancelSubscription,
        addPaymentMethod,
        removePaymentMethod,
        updateSubscription,
      }}
    >
      {children}
    </PaymentContext.Provider>
  )
}

export function usePayment() {
  const context = useContext(PaymentContext)
  if (context === undefined) {
    throw new Error("usePayment must be used within a PaymentProvider")
  }
  return context
}
