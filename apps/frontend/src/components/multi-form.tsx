"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import type { AxiosError } from "axios";
import type { ApiError } from "next/dist/server/api-utils";

const FormSchema = z.object({
  verifyCode: z.string().min(4, "Please enter the 4-digit code"),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type FormData = z.infer<typeof FormSchema>;

export const GeneratedForm = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      await api.post("/auth/user/resetPassword", {
        token: data.verifyCode,
        password: data.password,
      });
    },
    onSuccess: () => {
      toast.success("resetting password successfully.");
      router.push("/login");
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage =
        error.response?.data?.message ||
        "Invalid credentials. Please try again.";
      toast.error(errorMessage);
      console.error(error);
    },
  });
  const [step, setStep] = useState(0);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      verifyCode: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    control,
    trigger,
    formState: {},
  } = form;

  const processForm = async (data: FormData) => {
    mutation.mutate(data);
    console.log("Final form data:", data);
    setStep(0);
    form.reset();
  };

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    if (step === 0) {
      fieldsToValidate = ["verifyCode"];
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleResendCode = () => {
    // Add resend logic here
    toast.info("Code resent to your phone");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={handleSubmit(processForm)}>
            {/* OTP Step - matches screenshot design */}
            <div className={cn(step !== 0 && "hidden")}>
              <div className="text-center space-y-6">
                {/* Star Icon */}
                <div className="flex justify-center">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-700"
                    >
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                  </div>
                </div>

                {/* Heading and Description */}
                <div className="space-y-2">
                  <h1 className="text-xl font-semibold text-gray-900">
                    Enter the code
                  </h1>
                  <p className="text-sm text-gray-600">
                    Enter the 6-digit code sent to your phone number to complete
                    verification
                  </p>
                </div>

                {/* OTP Input */}
                <div className="flex justify-center">
                  <FormField
                    control={control}
                    name="verifyCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputOTP
                            {...field}
                            maxLength={6}
                            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                          >
                            <InputOTPGroup className="gap-3">
                              <InputOTPSlot
                                index={0}
                                className="w-12 h-12 text-lg border-gray-300 rounded-lg"
                              />
                              <InputOTPSlot
                                index={1}
                                className="w-12 h-12 text-lg border-gray-300 rounded-lg"
                              />
                              <InputOTPSlot
                                index={2}
                                className="w-12 h-12 text-lg border-gray-300 rounded-lg"
                              />
                              <InputOTPSlot
                                index={3}
                                className="w-12 h-12 text-lg border-gray-300 rounded-lg"
                              />
                              <InputOTPSlot
                                index={4}
                                className="w-12 h-12 text-lg border-gray-300 rounded-lg"
                              />
                              <InputOTPSlot
                                index={5}
                                className="w-12 h-12 text-lg border-gray-300 rounded-lg"
                              />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium"
                  >
                    Confirm and proceed
                  </Button>

                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Resend code
                  </button>
                </div>
              </div>
            </div>

            {/* Password Step - keeping original design */}
            <div className={cn(step !== 1 && "hidden")}>
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-xl font-semibold text-gray-900">
                    Set New Password
                  </h1>
                  <p className="text-sm text-gray-600">
                    Enter your new password to complete the reset
                  </p>
                </div>

                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          className="py-3"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 py-3 bg-transparent"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-black hover:bg-gray-800 py-3"
                  >
                    Reset Password
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
