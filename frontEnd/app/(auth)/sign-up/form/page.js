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
import { EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { useState } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";
  const router = useRouter();
  const [formValues, setFromValues] = useState({
    email: emailFromQuery,
    password: "",
    confirm: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFromValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState();

  const validatePassword = (password) => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return true;
    } else {
      setPasswordError("");
      return false;
    }
  };

  const validatePasswordConfirm = (confirm) => {
    if (formValues.password !== confirm) {
      setConfirmError("Confirm password must match from password");
      return true;
    } else {
      setConfirmError("");
      return false;
    }
  };

  const handleSubmit = async () => {
    const passwordError = validatePassword(formValues.password);
    const passwordConfirmError = validatePasswordConfirm(formValues.confirm);

    if (!passwordError && !passwordConfirmError) {
      console.log("email, password", formValues.email, formValues.password);
      console.log("we can call api");
      const Response = await server.post("auth/signUp", {
        email: formValues.email,
        password: formValues.password,
      });
      console.log("responce", Response);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen gap-30">
      <Card className="w-full max-w-sm bg-gray-50">
        <CardHeader>
          <CardTitle>Create a strong password</CardTitle>
          <CardDescription>
            Create a strong password with letters, numbers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Input
                  id="password"
                  type="name"
                  placeholder="Password"
                  required
                  value={formValues.password}
                  onChange={handleInputChange}
                />
                {passwordError && (
                  <div className="text-red-500">{passwordError}</div>
                )}
                <Input
                  id="confirm"
                  type="value"
                  placeholder="Confirm"
                  required
                  value={formValues.confirm}
                  onChange={handleInputChange}
                />
                {confirmError && (
                  <div className="text-red-500">{confirmError}</div>
                )}
                <div className="flex gap-2 pt-2">
                  <EyeOff /> Show password
                </div>
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
              onClick={() => router.push("/login")}
              variant="link"
              className="text-blue-700"
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
