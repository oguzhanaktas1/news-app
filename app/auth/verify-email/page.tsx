import { VerifyEmailForm } from "@/components/auth/verify-email-form"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      title="Email Verification"
      description="Verify your email address"
      backLink="/auth/login"
      backLinkText="Login"
    >
      <VerifyEmailForm />
    </AuthLayout>
  )
}
