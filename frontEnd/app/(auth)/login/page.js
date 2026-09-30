"use client";

import { server } from "@/app/api/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
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
  const router = useRouter();

  const [formValues, setFromValues] = useState({
    email: "",
    password: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFromValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return true;
    } else {
      setPasswordError("");
      return false;
    }
  };

  const validateEmail = (email) => {
    if (email === "") {
      setErrorEmail("Email is required");
    } else if (!email.includes("@")) {
      setEmailError("Invalid email. Use a format like example@email.com");
    } else {
      setEmailError("");
      return false;
    }
  };

  const handleClick = async () => {
    const passwordError = validatePassword(formValues.password);
    const passwordConfirmError = validateEmail(formValues.email);

    if (!passwordError && !passwordConfirmError) {
      try {
        const Res = await server.post("/auth/login", {
          email: formValues.email,
          password: formValues.password,
        });
        if (Res.status == 200) {
          router.push("/admin/dishes");
        }
      } catch (err) {
        if (err.response.status == 404) {
          setEmailError("user not found");
          console.error("Status Code:", err.response.status);
        } else if (err.response.status == 400) {
          setPasswordError("Wrong password");
        }
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen gap-35">
      <Card className="w-full max-w-sm bg-gray-50">
        <CardHeader>
          <CardTitle>Login </CardTitle>
          <CardDescription>
            Log in to enjoy your favorite dishes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6 ">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  value={formValues.email}
                  onChange={handleInputChange}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
                {emailError && <div className="text-red-500">{emailError}</div>}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  value={formValues.password}
                  onChange={handleInputChange}
                  id="password"
                  type="password"
                  required
                />
                {passwordError && (
                  <div className="text-red-500">{passwordError}</div>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button variant="outline" className="w-full" onClick={handleClick}>
            Let's Go
          </Button>
          <div>
            Don’t have an account?{" "}
            <Button variant="link" onClick={() => router.push("/sign-up")}>
              Sign Up
            </Button>
          </div>
        </CardFooter>
      </Card>
      <img src="/zurag.png" alt="logo" />
    </div>
  );
}
