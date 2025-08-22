"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, CreditCard, DollarSign, Bell } from "lucide-react"

interface PaymentNotification {
  id: string
  type: "payment_received" | "payout_processed" | "payment_failed" | "subscription_renewed"
  title: string
  description: string
  amount?: number
  date: Date
  read: boolean
  actionRequired?: boolean
}

const mockNotifications: PaymentNotification[] = [
  {
    id: "1",
    type: "payment_received",
    title: "Payment Received",
    description: "Payment of $150 received from Sarah Johnson for Business Consultation",
    amount: 150,
    date: new Date("2024-01-15T10:30:00"),
    read: false,
  },
  {
    id: "2",
    type: "payout_processed",
    title: "Payout Processed",
    description: "Weekly payout of $425 has been sent to your bank account",
    amount: 425,
    date: new Date("2024-01-12T09:00:00"),
    read: true,
  },
  {
    id: "3",
    type: "subscription_renewed",
    title: "Subscription Renewed",
    description: "Your Professional plan has been renewed for another month",
    amount: 49,
    date: new Date("2024-01-10T08:00:00"),
    read: true,
  },
  {
    id: "4",
    type: "payment_failed",
    title: "Payment Failed",
    description: "Payment attempt failed for client booking. Please follow up.",
    date: new Date("2024-01-08T14:20:00"),
    read: false,
    actionRequired: true,
  },
]

export function PaymentNotifications() {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "payment_received":
        return <DollarSign className="w-5 h-5 text-green-600" />
      case "payout_processed":
        return <CheckCircle className="w-5 h-5 text-blue-600" />
      case "payment_failed":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case "subscription_renewed":
        return <CreditCard className="w-5 h-5 text-purple-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getNotificationBadge = (notification: PaymentNotification) => {
    if (notification.actionRequired) {
      return <Badge variant="destructive">Action Required</Badge>
    }
    if (!notification.read) {
      return <Badge className="bg-blue-100 text-blue-800">New</Badge>
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Payment Notifications
        </CardTitle>
        <CardDescription>Recent payment activity and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start space-x-4 p-4 rounded-lg border ${
                !notification.read ? "bg-blue-50 border-blue-200" : "bg-gray-50"
              }`}
            >
              <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900">{notification.title}</p>
                  {getNotificationBadge(notification)}
                </div>
                <p className="text-sm text-gray-600 mb-2">{notification.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {notification.date.toLocaleDateString()} at {notification.date.toLocaleTimeString()}
                  </p>
                  {notification.amount && <p className="text-sm font-medium text-gray-900">${notification.amount}</p>}
                </div>
                {notification.actionRequired && (
                  <Button size="sm" className="mt-2">
                    Take Action
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
