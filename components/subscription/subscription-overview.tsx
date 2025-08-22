"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePayment } from "@/components/payment/payment-context"
import { PricingPlans } from "@/components/payment/pricing-plans"
import { PaymentMethodForm } from "@/components/payment/payment-method-form"
import { CreditCard, Calendar, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { useState } from "react"

export function SubscriptionOverview() {
  const { subscription, paymentMethods, plans, loading, cancelSubscription, updateSubscription } = usePayment()
  const [showPricingPlans, setShowPricingPlans] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  const currentPlan = subscription ? plans.find((plan) => plan.id === subscription.planId) : null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "trialing":
        return "bg-blue-100 text-blue-800"
      case "past_due":
        return "bg-yellow-100 text-yellow-800"
      case "canceled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />
      case "trialing":
        return <Calendar className="w-4 h-4" />
      case "past_due":
        return <AlertTriangle className="w-4 h-4" />
      case "canceled":
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Choose Your Plan</h2>
          <p className="text-gray-600">Select a subscription plan to get started</p>
        </div>
        <PricingPlans onSelectPlan={(planId) => setShowPricingPlans(true)} />
      </div>
    )
  }

  if (showPricingPlans) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Change Plan</h2>
            <p className="text-gray-600">Upgrade or downgrade your subscription</p>
          </div>
          <Button variant="outline" onClick={() => setShowPricingPlans(false)}>
            Cancel
          </Button>
        </div>
        <PricingPlans
          onSelectPlan={async (planId) => {
            await updateSubscription(planId)
            setShowPricingPlans(false)
          }}
          currentPlanId={subscription.planId}
        />
      </div>
    )
  }

  if (showPaymentForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Add Payment Method</h2>
            <p className="text-gray-600">Add a new payment method to your account</p>
          </div>
        </div>
        <PaymentMethodForm onSuccess={() => setShowPaymentForm(false)} onCancel={() => setShowPaymentForm(false)} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Subscription & Billing</h2>
        <p className="text-gray-600">Manage your subscription and payment methods</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current Plan</span>
              <Badge className={getStatusColor(subscription.status)}>
                {getStatusIcon(subscription.status)}
                <span className="ml-1 capitalize">{subscription.status}</span>
              </Badge>
            </CardTitle>
            <CardDescription>Your active subscription details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentPlan && (
              <div>
                <h3 className="text-xl font-semibold">{currentPlan.name}</h3>
                <p className="text-2xl font-bold text-blue-600">
                  ${currentPlan.price}
                  <span className="text-sm font-normal text-gray-500">/{currentPlan.interval}</span>
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Next billing date:</span>
                <span className="font-medium">{subscription.currentPeriodEnd.toLocaleDateString()}</span>
              </div>
              {subscription.cancelAtPeriodEnd && (
                <div className="flex items-center space-x-2 text-sm text-yellow-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Subscription will cancel on {subscription.currentPeriodEnd.toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowPricingPlans(true)} className="flex-1">
                Change Plan
              </Button>
              {!subscription.cancelAtPeriodEnd && (
                <Button variant="outline" onClick={cancelSubscription} className="flex-1 bg-transparent">
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Payment Methods</span>
              <Button size="sm" onClick={() => setShowPaymentForm(true)}>
                Add Card
              </Button>
            </CardTitle>
            <CardDescription>Manage your payment methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethods.length === 0 ? (
              <div className="text-center py-6">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No payment methods added</p>
                <Button size="sm" className="mt-2" onClick={() => setShowPaymentForm(true)}>
                  Add Payment Method
                </Button>
              </div>
            ) : (
              paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-100 p-2 rounded">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium capitalize">
                        {method.brand} •••• {method.last4}
                      </p>
                      <p className="text-sm text-gray-500">
                        Expires {method.expiryMonth.toString().padStart(2, "0")}/{method.expiryYear}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">Default</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Plan Features */}
      {currentPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Plan Features</CardTitle>
            <CardDescription>What's included in your {currentPlan.name} plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
