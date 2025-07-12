"use client";

import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const ResetSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Min 6 characters"),
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

  const initialValues: IResetForm = {
    password: "",
    email: "",
  };

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
    <div className="max-w-md mx-auto mt-8 p-4 border rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      {status === "idle" && <p className="text-gray-500">{msg}</p>}

      {status === "error" && (
        <div className="text-red-500 text-sm">
          {msg}
        </div>
      )}

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
                <Field type="hidden" name="email" />

                <div className="flex flex-col relative">
                  <label htmlFor="password" className="text-md">New Password</label>
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="mb-2 p-2 border border-gray-600 rounded-md pr-10"
                    aria-describedby="passwordError"
                    data-cy="password-input"
                  />
                  <div
                    className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                  {touched.password && errors.password && (
                    <div className="text-red-500 text-[12px] -mt-2">
                      {errors.password}
                    </div>
                  )}
                </div>

                <div className="mt-12">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-1 px-2 w-full btn-foreground text-sm rounded-md"
                    data-cy="submit-login"
                  >
                    {isSubmitting ? "Loading ..." : "Submit"}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
}
