import { LoginForm } from "@/components/auth/login-form"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function LoginPage() {
  return (
    <AuthLayout
      title="Login"
      description="Sign in to your account"
      backLink="/home"
      backLinkText="Home"
    >
      <LoginForm />
    </AuthLayout>
  )
}
