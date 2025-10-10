import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router';

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).nonempty({ message: "Email is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  firstname: z.string().min(1, { message: "Firstname is required" }),
  lastname: z.string().min(1, { message: "Lastname is required" }),
  amount: z.string().min(1, { message: "Amount is required" }),
});

type FormValues = z.infer<typeof formSchema>;

const Create = () => {
  const [files, setFiles] = useState<File[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()
  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async(values: FormValues) => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")

      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("firstname", values.firstname);
      formData.append("lastname", values.lastname);
      formData.append("email", values.email);
      formData.append("amount", values.amount);

      if (files) {
        files.forEach((file) => {
          formData.append("avatar", file); 
        });
      }
      // for (const [key, val] of formData.entries()) {
      //   console.log(key, val);
      // }
      const response = await axios.post("https://paypal-backend-e8c3.onrender.com/api/superuser/create-user", formData, {
        headers : {
          Authorization : `Bearer ${token}`
        }
      })
      console.log(response);
      if(response.status === 201){
        toast.success(response.data?.message);
        navigate("/dashboard/client-list")
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMsg = err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMsg);  console.error("Form submission error", error);
      
    }finally{
      setIsLoading(false)
    }
  };

  return (
    <>
      <h2 className='text-[20px] md:text-[30px] font-bold'>Create User</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Username" type="text" {...field} className='py-[20px] px-[12px] text-[16px]' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Firstname" type="text" {...field} className='py-[20px] px-[12px] text-[16px]' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Lastname" type="text" {...field} className='py-[20px] px-[12px] text-[16px]' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Client email" type="email" {...field} className='py-[20px] px-[12px] text-[16px]' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Amount" type="number" {...field} className='py-[20px] px-[12px] text-[16px]' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField */}
            {/* control={form.control}
            name="files"
            render={() => ( */}
              <FormItem>
                <FormLabel>Select File</FormLabel>
                <FormControl>
                  <FileUploader
                    value={files}
                    onValueChange={setFiles}
                    dropzoneOptions={dropZoneConfig}
                    className="relative bg-background rounded-lg p-2"
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
                      {files && files.length > 0 && files.map((file, i) => (
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
            {/* )} */}
          {/* /> */}

          <Button type="submit"                 
            variant="blueFull"
            className='rounded'
            size="lg"
          >
          {isLoading? "...Submitting" : "Create User"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default Create;
