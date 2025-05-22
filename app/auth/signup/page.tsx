import { SignupForm } from "@/components/auth/signup-form"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function SignupPage() {
  return (
    <AuthLayout
      title="Sign Up"
      description="Create a new account"
      backLink="/auth/login"
      backLinkText="Login"
    >
      <SignupForm />
    </AuthLayout>
  )
}
