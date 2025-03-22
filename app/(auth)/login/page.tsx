"use client";

import Image from "next/image"
import { Youtube,  EyeIcon as EyeClosed } from "lucide-react"
import XIcon from "@/public/assets/icons/x-dark.png"
import TiktokIcon from "@/public/assets/icons/tiktok-dark.png"
import WhatsappIcon from "@/public/assets/icons/whatsapp-dark.png"
import cardinalConfig from "@/config"
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/student/ui/alert";
import { login } from "@/lib/api/student/auth/login";
import { useAppDispatch } from "@/lib/hooks";
import { setAuthState } from "@/lib/authSlice";
import { fetchStudentsAssessment } from "@/lib/api/student/profile/fetchStudentAssessment";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setAlert({ type: "error", message: "Both email and password are required." });
      return;
    }

    setIsSubmitting(true);
    setAlert(null);

    try {
      const response = await login(formData.email, formData.password);

      if (response.status === "success") {
        dispatch(
          setAuthState({
            token: response.data.token,
            user: response.data.user,
          })
        );

        const assessmentResponse = await fetchStudentsAssessment(response.data.token);
        const assessment = assessmentResponse.data.Assessment;

        if (
          !assessment.education_level ||
          !assessment.subjects_interested_in ||
          !assessment.tests_interested_in ||
          !assessment.learning_expectations ||
          !assessment.specific_goals
        ) {
          router.push("/assessment");
        } else {
          setAlert({ type: "success", message: response.message });
          router.push("/student");
        }
      } else {
        setAlert({ type: "error", message: response.message });
      }
    } catch (error) {
      console.error("Login failed:", error);
      setAlert({ type: "error", message: (error as Error).message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
     
     
     
      {alert && (
        <Alert variant={alert.type === "success" ? "default" : "danger"} className="absolute bg-white top-4 right-4">
          <AlertTitle>{alert.type === "success" ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
     
     <div className="min-h-screen bg-white">
       <div className="flex min-h-screen items-center">
            {/* Left Column - Hidden on mobile and tablet */}
           <div className="hidden min-h-screen lg:flex lg:w-1/2 bg-[#E9FFFF] flex-col items-center justify-center p-8">
              <div className="max-w-md">
               <Image
              onDragStart={(event) => event.preventDefault()}
              src="/assets/img/pages/login/6955b465-50b7-4e9f-bdf9-d1e67efa258f-removebg-preview 1.png"
              alt="Learning Illustration"
              width={500}
              height={400}
              priority
            />
            <h1 className="text-3xl font-bold text-center mt-8 mb-4">
              Learn From Highly Skilled Experts & Experienced Tutors
            </h1>
            <div className="flex justify-center items-center mx-auto text-dark space-x-2 py-2">
              <a
                className="flex items-center space-x-2 hover:opacity-75 mx-2"
                target="_blank"
                href={`${cardinalConfig.socialInfo.whatsapp}`}
                rel="noreferrer"
              >
                <Image
                  onDragStart={(event) => event.preventDefault()}
                  src={WhatsappIcon || "/placeholder.svg"}
                  alt="whatsapp cion"
                />{" "}
              </a>
              <a
                className="flex items-center space-x-2 hover:opacity-75 mx-2"
                target="_blank"
                href={`${cardinalConfig.socialInfo.tikTok}`}
                rel="noreferrer"
              >
                <Image
                  onDragStart={(event) => event.preventDefault()}
                  src={TiktokIcon || "/placeholder.svg"}
                  alt="tiktok Icon"
                />{" "}
              </a>
              <a
                className="flex items-center space-x-2 hover:opacity-75 mx-2"
                target="_blank"
                href={`${cardinalConfig.socialInfo.youtube}`}
                rel="noreferrer"
              >
                {" "}
                <Youtube />{" "}
              </a>
              <a
                className="flex items-center space-x-2 hover:opacity-75 mx-2"
                target="_blank"
                href={`${cardinalConfig.socialInfo.X}`}
                rel="noreferrer"
              >
                <Image
                  onDragStart={(event) => event.preventDefault()}
                  src={XIcon || "/placeholder.svg"}
                  alt="X-cion"
                />{" "}
              </a>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/2 px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-right mb-8">
            <span className="text-sm text-gray-600  absolute top-10 right-10 h-max">
              Not a Cardinal?{" "}
              <Link href={cardinalConfig.routes.signup} className="text-[#1BC2C2] hover:underline font-semibold">
                Sign Up!
              </Link>
            </span>
          </div>
          <div className="max-w-lg block mx-auto items-center align-middle self-center">
            <h2 className="text-3xl font-bold mb-2">Log In</h2>
            <p className="text-gray-600 font-semibold mb-8">
              Enter your email address and password to securely log in to Cardinal E-School portal
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
            <div className="text-center mr-auto mt-4">Forgot Password ? <Link className="text-[#1BC2C2]" href="/resetpassword">Click here</Link></div>
          </div>
        </div>
      </div>
    </div>
    
    </div>
  );
}

