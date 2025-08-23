"use client"
import { AuthProvider, useAuth } from "@/components/auth-context"
import { LoginForm } from "@/components/auth/login-form"
import { Dashboard } from "@/components/dashboard/dashboard"
import { PaymentProvider } from "@/components/payment/payment-context"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { I18nProvider, useI18n } from "@/lib/i18n/context"
import { ArrowRight, Calendar, Clock, Star, Users } from "lucide-react"

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return user ? <Dashboard /> : <LandingPage />
}

function LandingPage() {
  const { t } = useI18n()
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{t("landing.appName")}</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <a href="/book/demo">{t("landing.tryDemo")}</a>
              </Button>
              <LoginForm />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t("landing.heroTitle")}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t("landing.heroDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8" asChild>
              <a href="/book/demo">
                {t("landing.tryDemo")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="px-8 bg-transparent">
              {t("landing.startFreeTrial")}
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("landing.everythingYouNeed")}</h2>
            <p className="text-gray-600">{t("landing.featuresDescription")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Calendar className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>{t("landing.smartScheduling")}</CardTitle>
                <CardDescription>{t("landing.smartSchedulingDescription")}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>{t("landing.clientManagement")}</CardTitle>
                <CardDescription>{t("landing.clientManagementDescription")}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>{t("landing.timeOptimization")}</CardTitle>
                <CardDescription>{t("landing.timeOptimizationDescription")}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("landing.seeItInAction")}</h2>
          <p className="text-gray-600 mb-8">{t("landing.demoDescription")}</p>
          <Card className="p-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">4.9 {t("landing.rating")}</span>
              </div>
              <div className="text-gray-300">•</div>
              <div className="font-medium">Dr. Samuel Johnson</div>
              <div className="text-gray-300">•</div>
              <div className="text-gray-600">{t("landing.businessConsultant")}</div>
            </div>
            <Button size="lg" asChild>
              <a href="/book/demo">
                {t("landing.bookDemoAppointment")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold">{t("landing.appName")}</h3>
          </div>
          <p className="text-gray-400">{t("landing.footerDescription")}</p>
        </div>
      </footer>
    </div>
  )
}

export default function Home() {
  return (
    <I18nProvider>
      <AuthProvider>
        <PaymentProvider>
          <AppContent />
        </PaymentProvider>
      </AuthProvider>
    </I18nProvider>
  )
}
