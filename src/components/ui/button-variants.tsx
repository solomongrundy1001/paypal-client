import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus:outline-none ",
    
  {
    variants: {
      variant: {
        //custom variant
        blueFull: "w-full bg-[var(--ppblue)] text-white rounded-full hover:bg-blue-700 text-[20px] mt-[10px] ",
        default: "bg-primary text-white hover:bg-primary/90",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-gray-300 text-black hover:bg-gray-100",
        ghost: "hover:bg-gray-100",
        link: "text-blue-800 underline hover:text-blue-600",
        
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-sm",
        lg: "h-12 px-10 text-base",
        icon: "p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
