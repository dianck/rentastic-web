"use client";

import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import * as yup from "yup";
import Link from "next/link"; // ✅ Tambahkan ini

const LoginSchema = yup.object().shape({
  login: yup.string().required("login is required"),
  password: yup
    .string()
    .required("password is required")
    .min(6, "min 6 character"),
});

interface ILoginForm {
  login: string;
  password: string;
}

export default function FormLogin() {
  const initialValues: ILoginForm = {
    login: "",
    password: "",
  };

  const onLogin = async (
    value: ILoginForm,
    action: FormikHelpers<ILoginForm>
  ) => {
    console.log("Form submitted with values:", value);
    try {
      const { data } = await axios.post("/auth/login", value);
      console.log("Login response data:", data);

      await signIn("credentials", {
        callbackUrl: "/home",
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        userToken: data.token,
        role: data.user.role,
        points: data.user.points,
        referralCode: data.user.referralCode,
      });

      toast.success(data.message);
      action.resetForm();
    } catch (err) {
      console.log("Error during login:", err);
      action.setSubmitting(false);
      if (err instanceof AxiosError) {
        console.log("Axios error details:", err.response?.data);
        toast.error(err.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={(values, action) => {
          onLogin(values, action);
        }}
      >
        {(props: FormikProps<ILoginForm>) => {
          const { touched, errors, isSubmitting } = props;
          return (
            <Form>
              <div className="flex flex-col">
                <label htmlFor="login" className="text-md">
                  Email or Username
                </label>
                <Field
                  name="login"
                  type="text"
                  className="mb-2 p-2 border border-gray-600 rounded-md "
                  aria-describedby="loginError"
                  data-cy="username-input"
                />
                {touched.login && errors.login && (
                  <div className="text-red-500 text-[12px] -mt-2">
                    {errors.login}
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="password" className="text-md">
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  className="mb-2 p-2 border border-gray-600 rounded-md"
                  data-cy="password-input"
                />
                {touched.password && errors.password && (
                  <div className="text-red-500 text-[12px] -mt-2">
                    {errors.password}
                  </div>
                )}
                {/* ✅ Tambahkan tautan register di sini */}
                <div className="mt-2 text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-blue-600 underline">
                    Register here
                  </Link>
                </div>
              </div>


                  {/* className="py-1 px-2 w-full  rounded-md transition disabled:opacity-50" */}

              <div className="mt-12">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-1 px-2 w-full btn-foreground text-sm rounded-md"
                  data-cy="submit-login"
                >
                  {isSubmitting ? "Loading ..." : "Sign in"}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
