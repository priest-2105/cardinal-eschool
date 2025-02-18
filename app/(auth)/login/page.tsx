"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Input, Button } from "@/components/ui"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useForm } from "react-hook-form"

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

const LoginPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true)

    try {
      const credentials = {
        email: data.email,
        password: data.password,
      }

      const result = await signIn("credentials", {
        redirect: false,
        ...credentials,
      })

      if (result?.error) {
        // Handle error
        console.error("Login failed:", result.error)
        // Add error handling here, e.g., display an error message
      } else {
        router.push("/")
      }
    } catch (error) {
      console.error("Login failed:", error)
      // Add error handling here, e.g., display an error message
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Input {...form.register("email")} type="email" placeholder="Email" className="w-full" />
            {form.formState.errors.email && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="mb-4">
            <Input {...form.register("password")} type="password" placeholder="Password" className="w-full" />
            {form.formState.errors.password && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div className="mb-4">
            <Button type="submit" className="w-full" size="lg">
              Submit
            </Button>
          </div>
          <div className="text-center">
            <Link href="/auth/register">Don't have an account? Register here.</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage

