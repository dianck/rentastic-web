"use client";

import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Eye, EyeOff, Home } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";

const ResetSchema = yup.object().shape({
  password: yup.string().required("Password is required").min(6, "Min 6 characters"),
});

interface IResetForm {
  password: string;
  email: string;
}

export default function ResetPasswordPage({ token }: { token: string }) {
  const [msg, setMsg] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const router = useRouter();

  const initialValues: IResetForm = { password: "", email: "" };

  const onVerify = useCallback(async () => {
    try {
      setMsg("Verifying link...");
      const { data } = await axios.patch("/auth/verify-reset-pwd", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMsg(data.message);
      setEmail(data.user.email);
      setStatus("success");
    } catch (err) {
      let errorMsg = "Verification failed.";
      if (err instanceof AxiosError && err.response?.status === 404) {
        errorMsg = err.response?.data?.message || "Link not valid or expired.";
      }
      setMsg(errorMsg);
      setStatus("error");
    }
  }, [token]);

  useEffect(() => {
    onVerify();
  }, [onVerify]);

  const onReset = async (value: IResetForm, action: FormikHelpers<IResetForm>) => {
    try {
      const { data } = await axios.post("/auth/reset-pwd", value);
      toast.success(data.message);
      action.resetForm();
      router.push("/login");
    } catch (err) {
      action.setSubmitting(false);
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Reset Password failed");
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Link
        href="/"
        className="flex justify-center mb-6 items-center gap-2 font-bold text-2xl text-primary"
      >
        <Home className="h-7 w-7" />
        <span className="font-headline">
          {process.env.NEXT_PUBLIC_APP_NAME || "NestEase"}
        </span>
      </Link>

      <Card>
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            {status === "idle" && msg}
            {status === "error" && (
              <span className="text-red-500 font-medium">{msg}</span>
            )}
          </CardDescription>
        </CardHeader>

        {status === "success" && (
          <Formik
            enableReinitialize
            initialValues={{ ...initialValues, email }}
            validationSchema={ResetSchema}
            onSubmit={onReset}
          >
            {(props: FormikProps<IResetForm>) => {
              const { touched, errors, isSubmitting } = props;
              return (
                <Form>
                  <CardContent className="space-y-4">
                    <Field type="hidden" name="email" />

                    <div className="relative space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                      />
                      <div
                        className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </div>
                      {touched.password && errors.password && (
                        <p className="text-red-500 text-sm">{errors.password}</p>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="py-1 px-2 w-full btn-foreground text-sm rounded-md"
                    >
                      {isSubmitting ? "Resetting..." : "Submit"}
                    </Button>
                  </CardFooter>
                </Form>
              );
            }}
          </Formik>
        )}
      </Card>
    </div>
  );
}
