import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset Password"
      description="Set your new password"
      backLink="/auth/login"
      backLinkText="Login"
    >
      <ResetPasswordForm />
    </AuthLayout>
  )
}
