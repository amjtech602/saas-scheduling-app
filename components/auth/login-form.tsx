"use client"

import { initiateSocialLogin } from "@/app/services/authService"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { useI18n } from "@/lib/i18n/context"
import { useI18n } from "@/lib/i18n/context"
import { DialogTitle } from "@radix-ui/react-dialog"
import { Calendar, Clock, Users } from "lucide-react"
import type React from "react"
import { useState } from "react"

export function LoginForm() {
  const { login, register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    name: "",
    businessName: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(loginData.email, loginData.password)
      setOpen(false)
    } catch (error) {
      console.error(t("auth.loginFailed"), error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await register(registerData.email, registerData.password, registerData.name, registerData.businessName)
      setOpen(false)
    } catch (error) {
      console.error(t("auth.registrationFailed"), error)
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button variant="default">{t("auth.signIn")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <DialogTitle></DialogTitle>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{t("landing.appName")}</h2>
              <p className="text-gray-600 text-sm">{t("landing.tagline")}</p>
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="bg-gray-50 p-2 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600 mx-auto" />
              </div>
              <p className="text-xs text-gray-600">{t("landing.smartScheduling")}</p>
            </div>
            <div className="space-y-2">
              <div className="bg-gray-50 p-2 rounded-lg">
                <Clock className="h-4 w-4 text-green-600 mx-auto" />
              </div>
              <p className="text-xs text-gray-600">{t("landing.timeOptimization")}</p>
            </div>
            <div className="space-y-2">
              <div className="bg-gray-50 p-2 rounded-lg">
                <Users className="h-4 w-4 text-purple-600 mx-auto" />
              </div>
              <p className="text-xs text-gray-600">{t("landing.clientManagement")}</p>
            </div>
          </div>

          {/* Auth Forms */}
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t("auth.signIn")}</TabsTrigger>
              <TabsTrigger value="register">{t("auth.getStarted")}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{t("auth.welcomeBack")}</h3>
                  <p className="text-sm text-gray-600">{t("auth.signInDescription")}</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">{t("auth.email")}</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="professional@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">{t("auth.password")}</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t("auth.signingIn") : t("auth.signIn")}
                  </Button>

                  <div className="flex items-center space-x-2 mt-2">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs text-gray-500">{t("auth.or")}</span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => initiateSocialLogin('google')}
                    className="w-full mt-2 flex items-center justify-center gap-2"
                  >
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{t("auth.signInWithGoogle")}</span>
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="register">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{t("auth.createAccount")}</h3>
                  <p className="text-sm text-gray-600">{t("auth.createAccountDescription")}</p>
                </div>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">{t("auth.fullName")}</Label>
                    <Input
                      id="register-name"
                      placeholder="John Doe"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-business">{t("auth.businessNameOptional")}</Label>
                    <Input
                      id="register-business"
                      placeholder="Doe Consulting"
                      value={registerData.businessName}
                      onChange={(e) => setRegisterData({ ...registerData, businessName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">{t("auth.email")}</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="john@example.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">{t("auth.password")}</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t("auth.creatingAccount") : t("auth.createAccountButton")}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
