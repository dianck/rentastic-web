"use client";

import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import { AxiosError } from "axios";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Home } from "lucide-react";

interface ILoginForm {
  login: string;
  password: string;
}

const LoginSchema = yup.object().shape({
  login: yup.string().required("login is required"),
  password: yup.string().required("password is required").min(6, "min 6 character"),
});

export default function FormLoginForm() {
  const router = useRouter();
  const [isGoogleLoading, setGoogleLoading] = React.useState(false);

  const initialValues: ILoginForm = { login: "", password: "" };

  const onLogin = async (value: ILoginForm, action: FormikHelpers<ILoginForm>) => {
    try {
      const { data } = await axios.post("/auth/login", value);

      await signIn("credentials", {
        redirect: true,
        callbackUrl: "/home",
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        avatar: data.user.avatar,
        userToken: data.token,
        role: data.user.role,
        isAvailable: data.user.isAvailable,
      });

      toast.success(data.message);
      action.resetForm();
    } catch (err) {
      action.setSubmitting(false);
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <div className="w-full max-w-md">
      <Link href="/" className="flex justify-center mb-6 items-center gap-2 font-bold text-2xl text-primary">
        <Home className="h-7 w-7" />
        <span className="font-headline">{process.env.NEXT_PUBLIC_APP_NAME || 'NestEase'}</span>
      </Link>

      <Card>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back, User!</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div
            onClick={() => {
              setGoogleLoading(true);
              signIn("google", { callbackUrl: "/home" });
            }}
            className="w-full border px-4 py-2 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-100"
          >
            {isGoogleLoading ? "Redirecting..." : "Login with Google"}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={LoginSchema}
            onSubmit={onLogin}
          >
            {({ errors, touched, isSubmitting }: FormikProps<ILoginForm>) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login">Login</Label>
                  <Field id="login" name="login" as={Input} placeholder="Enter your email or username" />
                  {touched.login && errors.login && (
                    <div className="text-red-500 text-sm">{errors.login}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Field id="password" name="password" type="password" as={Input} placeholder="Enter your password" />
                  {touched.password && errors.password && (
                    <div className="text-red-500 text-sm">{errors.password}</div>
                  )}
                  <div className="text-right">
                    <Link
                      href="/forgot-password"
                      className="text-xs hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-1 px-2 w-full btn-foreground text-sm rounded-md"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </Form>
            )}
          </Formik>
        </CardContent>

        <CardFooter className="text-center text-sm">
          <p className="w-full">
            Don&apos;t have an account? <Link href="/register" className="underline">Sign up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
