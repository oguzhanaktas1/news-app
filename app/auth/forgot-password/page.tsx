import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot My Password"
      description="Enter your email address to reset your password"
      backLink="/auth/login"
      backLinkText="Log In"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
