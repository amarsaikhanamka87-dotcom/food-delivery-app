"use client";

import { server } from "@/app/api/api";
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
import { useRouter } from "next/navigation";

import { useState } from "react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState();
  const router = useRouter();

  const handleSubmit = async () => {
    console.log("cliked");
    if (email === "") {
      setErrorEmail("Email is required");
    } else if (!email.includes("@")) {
      setErrorEmail("Invalid email. Use a format like example@email.com");
    } else {
      setEmail("");
      setErrorEmail("");
      router.push(`/sign-up/form?email=${encodeURIComponent(email)}`); // email props damjuulmaar bna
    }
  };

  return (
    <div className="flex justify-center items-center h-screen gap-30">
      <Card className="w-full max-w-sm bg-gray-50">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Sign up to explore your favorite dishes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                {errorEmail && <div className="text-red-500">{errorEmail}</div>}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button variant="outline" className="w-full" onClick={handleSubmit}>
            Let's Go
          </Button>
          <div>
            Already have an account?{" "}
            <Button
              variant="link"
              className="text-blue-700"
              onClick={() => router.push("/login")}
            >
              Login Up
            </Button>
          </div>
        </CardFooter>
      </Card>
      <img src="/zurag.png" alt="logo" />
    </div>
  );
}
