"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  DollarSign,
  TrendingUp,
  Download,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface Transaction {
  id: string
  type: "payment" | "payout" | "refund" | "fee"
  amount: number
  description: string
  date: Date
  status: "completed" | "pending" | "failed"
  clientName?: string
  serviceName?: string
}

const mockTransactions: Transaction[] = [
  {
    id: "txn_001",
    type: "payment",
    amount: 150,
    description: "Business Consultation",
    date: new Date("2024-01-15"),
    status: "completed",
    clientName: "Sarah Johnson",
    serviceName: "Business Consultation",
  },
  {
    id: "txn_002",
    type: "payment",
    amount: 75,
    description: "Follow-up Session",
    date: new Date("2024-01-15"),
    status: "completed",
    clientName: "Mike Chen",
    serviceName: "Follow-up Session",
  },
  {
    id: "txn_003",
    type: "payout",
    amount: -180,
    description: "Weekly payout to bank account",
    date: new Date("2024-01-14"),
    status: "completed",
  },
  {
    id: "txn_004",
    type: "payment",
    amount: 200,
    description: "Strategy Planning Workshop",
    date: new Date("2024-01-13"),
    status: "pending",
    clientName: "Alex Rivera",
    serviceName: "Strategy Planning Workshop",
  },
  {
    id: "txn_005",
    type: "fee",
    amount: -7.5,
    description: "Platform fee (5%)",
    date: new Date("2024-01-13"),
    status: "completed",
  },
]

export function BillingDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("30")
  const [selectedTab, setSelectedTab] = useState("overview")

  const totalRevenue = mockTransactions
    .filter((t) => t.type === "payment" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const pendingRevenue = mockTransactions
    .filter((t) => t.type === "payment" && t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalFees = Math.abs(mockTransactions.filter((t) => t.type === "fee").reduce((sum, t) => sum + t.amount, 0))

  const netRevenue = totalRevenue - totalFees

  const getTransactionIcon = (type: string, status: string) => {
    if (status === "pending") return <Clock className="w-4 h-4 text-yellow-500" />
    if (status === "failed") return <AlertCircle className="w-4 h-4 text-red-500" />

    switch (type) {
      case "payment":
        return <ArrowUpRight className="w-4 h-4 text-green-500" />
      case "payout":
        return <ArrowDownRight className="w-4 h-4 text-blue-500" />
      case "refund":
        return <ArrowDownRight className="w-4 h-4 text-red-500" />
      case "fee":
        return <ArrowDownRight className="w-4 h-4 text-gray-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Billing & Earnings</h2>
          <p className="text-gray-600">Track your revenue, transactions, and payouts</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${netRevenue}</div>
            <p className="text-xs text-muted-foreground">After platform fees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingRevenue}</div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFees}</div>
            <p className="text-xs text-muted-foreground">5% of gross revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { id: "overview", label: "Overview" },
          { id: "transactions", label: "Transactions" },
          { id: "payouts", label: "Payouts" },
          { id: "reports", label: "Reports" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest payment activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(transaction.type, transaction.status)}
                      <div>
                        <p className="text-sm font-medium">{transaction.description}</p>
                        <p className="text-xs text-gray-500">
                          {transaction.date.toLocaleDateString()}
                          {transaction.clientName && ` • ${transaction.clientName}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-medium ${transaction.amount > 0 ? "text-green-600" : "text-gray-900"}`}
                      >
                        {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount)}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payout Information */}
          <Card>
            <CardHeader>
              <CardTitle>Next Payout</CardTitle>
              <CardDescription>Scheduled payout information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">Available Balance</span>
                  <span className="text-2xl font-bold text-blue-900">${netRevenue}</span>
                </div>
                <p className="text-xs text-blue-700">Will be paid out on Friday, Jan 19</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payout method</span>
                  <span className="font-medium">Bank account •••• 1234</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payout schedule</span>
                  <span className="font-medium">Weekly (Fridays)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Processing time</span>
                  <span className="font-medium">1-2 business days</span>
                </div>
              </div>

              <Button className="w-full bg-transparent" variant="outline">
                <CreditCard className="w-4 h-4 mr-2" />
                Manage Payout Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === "transactions" && (
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>Complete history of your payment activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getTransactionIcon(transaction.type, transaction.status)}
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{transaction.date.toLocaleDateString()}</span>
                        {transaction.clientName && (
                          <>
                            <span>•</span>
                            <span>{transaction.clientName}</span>
                          </>
                        )}
                        <span>•</span>
                        <span className="capitalize">{transaction.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.amount > 0 ? "text-green-600" : "text-gray-900"}`}>
                      {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount)}
                    </p>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedTab === "payouts" && (
        <Card>
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
            <CardDescription>Track your payout history and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Payout Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Bank Account</p>
                    <p className="font-medium">Chase Bank •••• 1234</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Schedule</p>
                    <p className="font-medium">Weekly (Fridays)</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                  Update Settings
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-medium">Recent Payouts</h3>
                {mockTransactions
                  .filter((t) => t.type === "payout")
                  .map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <ArrowDownRight className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="font-medium">{payout.description}</p>
                          <p className="text-sm text-gray-500">{payout.date.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${Math.abs(payout.amount)}</p>
                        {getStatusBadge(payout.status)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedTab === "reports" && (
        <Card>
          <CardHeader>
            <CardTitle>Financial Reports</CardTitle>
            <CardDescription>Download reports for accounting and tax purposes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Monthly Summary</h3>
                <p className="text-sm text-gray-600 mb-3">Detailed breakdown of revenue, fees, and payouts</p>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Tax Report</h3>
                <p className="text-sm text-gray-600 mb-3">Annual summary for tax filing purposes</p>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Transaction Export</h3>
                <p className="text-sm text-gray-600 mb-3">Export all transactions for custom analysis</p>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Client Payments</h3>
                <p className="text-sm text-gray-600 mb-3">Summary of payments by client</p>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
