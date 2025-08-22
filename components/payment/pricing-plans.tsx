"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"
import { usePayment, type PaymentPlan } from "./payment-context"
import { useState } from "react"

interface PricingPlansProps {
  onSelectPlan?: (planId: string) => void
  currentPlanId?: string
}

export function PricingPlans({ onSelectPlan, currentPlanId }: PricingPlansProps) {
  const { plans } = usePayment()
  const [selectedInterval, setSelectedInterval] = useState<"month" | "year">("month")

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="bg-muted p-1 rounded-lg">
          <Button
            variant={selectedInterval === "month" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedInterval("month")}
          >
            Monthly
          </Button>
          <Button
            variant={selectedInterval === "year" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedInterval("year")}
          >
            Yearly
            <Badge variant="secondary" className="ml-2">
              Save 20%
            </Badge>
          </Button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            interval={selectedInterval}
            isCurrentPlan={currentPlanId === plan.id}
            onSelect={() => onSelectPlan?.(plan.id)}
          />
        ))}
      </div>
    </div>
  )
}

interface PlanCardProps {
  plan: PaymentPlan
  interval: "month" | "year"
  isCurrentPlan: boolean
  onSelect: () => void
}

function PlanCard({ plan, interval, isCurrentPlan, onSelect }: PlanCardProps) {
  const price = interval === "year" ? Math.floor(plan.price * 0.8) : plan.price
  const yearlyDiscount = interval === "year" ? plan.price * 12 - price * 12 : 0

  return (
    <Card className={`relative ${plan.popular ? "border-blue-500 shadow-lg" : ""}`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-500 text-white">
            <Star className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <div className="space-y-1">
          <div className="text-3xl font-bold">
            ${price}
            <span className="text-sm font-normal text-muted-foreground">/{interval}</span>
          </div>
          {interval === "year" && yearlyDiscount > 0 && (
            <div className="text-sm text-green-600">Save ${yearlyDiscount}/year</div>
          )}
        </div>
        <CardDescription>Perfect for {plan.name.toLowerCase()} users</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          className="w-full"
          variant={plan.popular ? "default" : "outline"}
          onClick={onSelect}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? "Current Plan" : `Choose ${plan.name}`}
        </Button>
      </CardContent>
    </Card>
  )
}
