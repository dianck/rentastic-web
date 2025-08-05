"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home } from "lucide-react";
import * as yup from "yup";

import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import axios from "@/lib/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import React from "react";
import { signIn } from "next-auth/react";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.94 11.05c0-1.23-.1-2.45-.29-3.63H12v6.86h5.03c-.22 1.48-.86 2.76-1.88 3.63v4.46h5.7c3.34-3.08 5.3-7.61 5.3-11.32z" fill="#4285F4" stroke="none" />
      <path d="M12 22c3.24 0 5.95-1.07 7.93-2.9l-5.7-4.46c-1.07.72-2.45 1.15-4.23 1.15-3.24 0-6-2.15-7-5.08H.79v4.6C2.76 20.07 6.95 22 12 22z" fill="#34A853" stroke="none"/>
      <path d="M5 14.1c-.2-.6-.3-1.23-.3-1.88s.1-1.28.3-1.88V5.79H.79C.29 6.95 0 8.35 0 9.8c0 1.45.29 2.85.79 4.01l4.21-3.71z" fill="#FBBC05" stroke="none"/>
      <path d="M12 5.23c1.73 0 3.28.6 4.5 1.83l4.85-4.85C18.95.88 15.7.01 12 .01 6.95.01 2.76 2.93.79 7.29l4.21 3.29c1-2.93 3.76-5.08 7-5.08z" fill="#EA4335" stroke="none"/>
    </svg>
  );
}

const RegisterSchema = yup.object().shape({
  username: yup.string().required("username is required"),
  email: yup
    .string()
    .required("email is required")
    .email("invalid email format"),
  password: yup
    .string()
    .required("password is required")
    .min(6, "min 6 character"),

});

interface IRegisterForm {
  username: string;
  email: string;
  password: string;
}

export default function FormRegister() {
  const router = useRouter();
  const [isGoogleLoading, setGoogleLoading] = React.useState(false);

  const initialValues: IRegisterForm = {
    username: "",
    email: "",
    password: "",
  };

  const onRegister = async (
    value: IRegisterForm,
    action: FormikHelpers<IRegisterForm>
  ) => {
    try {

      await axios.post("/auth/register", value);
      toast.success("Register successfully, please VERIFY on your mailbox!");
      action.resetForm();
      router.push("/");

    } catch (err) {
      console.log(err);
      action.setSubmitting(false);
      toast.error("Register failed");
    }
  };


  return (
    // <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex justify-center mb-6 items-center gap-2 font-bold text-2xl text-primary">
          <Home className="h-7 w-7" />
          <span className="font-headline">{process.env.NEXT_PUBLIC_APP_NAME || 'NestEase'}</span>

        </Link>
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Create a User Account</CardTitle>
            <CardDescription>Enter your information to create an account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* <Button variant="outline" className="w-full">
              <GoogleIcon className="mr-2 h-4 w-4" />
              Sign up with Google
            </Button> */}

          <div
            onClick={() => {
              setGoogleLoading(true);
              signIn("google", { callbackUrl: "/home" });
            }}
            className="w-full border px-4 py-2 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-100"
          >
            <GoogleIcon className="mr-2 h-4 w-4" />
            {isGoogleLoading ? "Redirecting..." : "Sign up with Google"}
          </div>

            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>


            <Formik
              initialValues={initialValues}
              validationSchema={RegisterSchema}
              onSubmit={(values, action) => {
                onRegister(values, action);
              }}
            >
              {(props: FormikProps<IRegisterForm>) => {
                const { touched, errors, isSubmitting } = props;

                return (
                  <Form>
                    <div className="space-y-4">
                      {/* Full Name */}
                      <div className="space-y-1">
                        <Label htmlFor="username">Full Name</Label>
                        <Field
                          name="username"
                          type="text"
                          placeholder="John Doe"
                          className="w-full p-2 border border-gray-600 rounded-md"
                        />
                        {touched.username && errors.username && (
                          <div className="text-red-500 text-sm">{errors.username}</div>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Field
                          name="email"
                          type="email"
                          placeholder="m@example.com"
                          className="w-full p-2 border border-gray-600 rounded-md"
                        />
                        {touched.email && errors.email && (
                          <div className="text-red-500 text-sm">{errors.email}</div>
                        )}
                      </div>

                      {/* Password */}
                      <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <Field
                          name="password"
                          type="password"
                          placeholder="******"
                          className="w-full p-2 border border-gray-600 rounded-md"
                        />
                        {touched.password && errors.password && (
                          <div className="text-red-500 text-sm">{errors.password}</div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="py-1 px-2 w-full text-sm rounded-md cursor-pointer text-white bg-[#9f25f08c] hover:bg-[#9f25f0] disabled:opacity-50"

                        >
                          {isSubmitting ? "Loading ..." : "Sign up"}
                        </button>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>


          </CardContent>
          <CardFooter className="text-center text-sm">
             <p className="w-full">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                    Log in
                </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    // </div>
  );
}
