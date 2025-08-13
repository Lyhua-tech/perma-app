"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { useAuthStore } from "@/lib/store/authStore";
import { AxiosError } from "axios";

// The Zod schema is perfect, no changes needed.
const FormSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

// Define a type for the expected API error structure
interface ApiError {
  message: string;
}

export function LoginForm() {
  const router = useRouter();

  // 1. Get the login action directly from our authentication store.
  const loginAction = useAuthStore((state) => state.login);

  const mutation = useMutation({
    // 2. The mutation now calls the centralized login action from the store.
    // This action handles the API call and state updates (token, user, etc.).
    mutationFn: (data: z.infer<typeof FormSchema>) =>
      loginAction(data.email, data.password),

    onSuccess: (user) => {
      toast.success(`Welcome back, ${user.email}!`);

      // ✅ Implement the role-based redirect
      if (user.role === "admin") {
        router.push("/admin"); // Admins go to the admin page
      } else {
        router.push("/inventory"); // All other users go to inventory
      }
    },

    onError: (error: AxiosError<ApiError>) => {
      // 4. We can provide a more specific error message from the backend.
      const errorMessage =
        error.response?.data?.message ||
        "Invalid credentials. Please try again.";
      toast.error(errorMessage);
      console.error(error);
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 5. The onSubmit function is now much cleaner. It just triggers the mutation.
  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutation.mutate(data);
  }

  return (
    // We wrap everything in a div for better structure
    <div className="flex flex-col items-center justify-center w-full md:text-neutral-800 text-white">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="md:text-black text-white">
                  Email
                </FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="md:text-black text-white">
                  Password
                </FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </Form>
      <p className="text-sm mt-4 text-center text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href={"/signup"} className="underline hover:text-primary">
          Sign up
        </Link>
      </p>
      <p className="text-sm mt-4 text-center text-muted-foreground">
        Forget Password ?{" "}
        <Link href={"/reset-password"} className="underline hover:text-primary">
          Forgot password
        </Link>
      </p>
    </div>
  );
}
