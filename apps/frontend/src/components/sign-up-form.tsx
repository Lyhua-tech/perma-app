"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const FormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  email: z.email("invalid email"),
  password: z.string().min(12, "Password is not strong enough"),
});

const request_url = process.env.NEXT_PUBLIC_BACKEND_URL!;

export function InputForm() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (data: UserRegister) =>
      axios.post(`${request_url}/auth/user/register`, data),
    onSuccess: () => {
      toast.success("Registered!");
      router.push("/inventory");
    },
    onError: (error) => {
      toast.error("Failed to register");
      console.error(error);
    },
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutation.mutateAsync(data);
      // The toast is already handled in mutation's onSuccess/onError
    } catch (error) {
      console.error(error);
      toast.error("Failed to register user");
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-3 md:text-black text-white "
        >
          <div className="lg:flex lg:gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="lg:my-0 my-3">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="firstname"
                      {...field}
                      className="md:placeholder-black placeholder-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="lg:my-0 my-3">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="lastname"
                      {...field}
                      className="md:placeholder-black placeholder-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="email"
                    {...field}
                    className="md:placeholder-black placeholder-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} className="md:placeholder-black placeholder-white"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {mutation.isPending ? "...Submitting" : "Submit"}
          </Button>
        </form>
      </Form>
      <>
        <h3 className="text-sm mt-2">
          Already has account ?{" "}
          <Link href={"/login"} className="underline">
            Sign in
          </Link>
        </h3>
      </>
    </>
  );
}
