"use client";

import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";

const ResetSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format") // ✅ format validasi
    .required("Email is required"),
});


interface IResetForm {
  email: string;
}

export default function ForgotPassword() {
  const initialValues: IResetForm = {
    email: "",
  };

  const onReset = async (
    value: IResetForm,
    action: FormikHelpers<IResetForm>
  ) => {
    console.log("Form submitted with values:", value);
    try {
      const { data } = await axios.post("/auth/email-conf-pwd", value);
      console.log("Email confirmation for password reset:", data);

      toast.success(data.message);
      action.resetForm();
    } catch (err) {
      console.log("Error during login:", err);
      action.setSubmitting(false);
      if (err instanceof AxiosError) {
        console.log("Axios error details:", err.response?.data);
        toast.error(err.response?.data?.message || "Email confirmation for password reset failed");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={ResetSchema}
        onSubmit={(values, action) => {
          onReset(values, action);
        }}
      >
        {(props: FormikProps<IResetForm>) => {
          const { touched, errors, isSubmitting } = props;
          return (
            <Form>
              <div className="flex flex-col">
                <label htmlFor="login" className="text-md">
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  className="mb-2 p-2 border border-gray-600 rounded-md "
                  aria-describedby="loginError"
                  data-cy="email-input"
                />
                {touched.email && errors.email && (
                  <div className="text-red-500 text-[12px] -mt-2">
                    {errors.email}
                  </div>
                )}
              </div>

                  {/* className="py-1 px-2 w-full  rounded-md transition disabled:opacity-50" */}

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
    </div>
  );
}
