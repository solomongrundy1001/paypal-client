import logo from "../assets/paypal_black.png";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, {AxiosError} from "axios"
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useNavigate } from "react-router";
import { useState } from "react";

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
      setIsLoading(true)
      const response = await axios.post("https://paypal-backend-e8c3.onrender.com/api/superuser/auth/login", values, {
        headers : {
          "Content-Type" : "application/json"
        }
      })
      
      if(response?.status === 201){ 
        toast.success(response.data?.message);
        localStorage.setItem("token", response.data?.data?.token);
        navigate("/dashboard/create-client")
      }

    }catch(error){
      const err = error as AxiosError<{ message?: string }>;
      const errorMsg = err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMsg);
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-white px-4">
      <Card className="w-full px-[30px] pt-[30px] pb-[50px] max-w-[460px] ">
        <CardHeader className="flex justify-center">
          <CardTitle>
            <img src={logo} alt="PayPal" className="w-[100px] " />
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl >
                      <Input placeholder="Email or mobile number" 
                      className="py-[20px] px-[12px] text-[16px]"
                      id="login-input" {...field} />
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
                    <FormLabel></FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Enter your password" className="py-[20px] px-[12px] text-[16px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <a href="" className="text-lef">Forgot your password?</a>
              <Button
                type="submit"
                variant="blueFull"
                size="lg"
              >
                {isLoading? "...logging in" : "Log in"}
              </Button>

            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

export default Login;
