"use client";

import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";

import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ Tambahkan ini
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home } from "lucide-react";

const ResetSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

interface IResetForm {
  email: string;
}

export default function ForgotPassword() {
  const router = useRouter(); // ✅ Gunakan router
  const initialValues: IResetForm = { email: "" };

  const onReset = async (
    value: IResetForm,
    action: FormikHelpers<IResetForm>
  ) => {
    try {
      const { data } = await axios.post("/auth/email-conf-pwd", value);
      toast.success(data.message);

      action.resetForm();

      // ✅ Redirect ke login setelah 1.5 detik
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      action.setSubmitting(false);
      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data?.message ||
            "Email confirmation for password reset failed"
        );
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

      <Formik
        initialValues={initialValues}
        validationSchema={ResetSchema}
        onSubmit={onReset}
      >
        {(props: FormikProps<IResetForm>) => {
          const { touched, errors, isSubmitting } = props;
          return (
            <Form>
              <Card>
                <CardHeader className="space-y-1 text-center">
                  <CardTitle className="text-2xl font-bold">
                    Forgot Password?
                  </CardTitle>
                  <CardDescription>
                    Enter your email to reset your password
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      as={Input}
                      placeholder="m@example.com"
                      aria-describedby="emailError"
                      data-cy="email-input"
                    />
                    {touched.email && errors.email && (
                      <div className="text-red-500 text-sm" id="emailError">
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-1 px-2 w-full btn-foreground text-sm rounded-md"
                    data-cy="submit-reset"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </CardContent>

                <CardFooter className="text-center text-sm">
                  <p className="w-full">
                    Remember your password?{" "}
                    <Link href="/login" className="underline">
                      Login
                    </Link>
                  </p>
                </CardFooter>
              </Card>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
