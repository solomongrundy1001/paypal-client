import React from "react";
import { defaultProfile } from "./defaultProfile";
import { Skeleton } from "@/components/ui/skeleton"

interface TicketCardProps {
  avatar: string;
  username: string;
  email: string;
  amount: string;
  isLoading: boolean
}

const TicketCard: React.FC<TicketCardProps> = ({ avatar, username, email, amount, isLoading }) => {
  console.log(isLoading)

  return (
    <div className="relative w-full max-w-sm m-auto">
      {/* Outer ticket */}
      <div className="relative bg-white/70 backdrop-blur-md shadow-lg rounded-xl overflow-visible">
        {/* Top Section */}
        <div className="relative px-6 pt-16 pb-6 text-center rounded-t-xl">
          {/* Avatar Container */}
          {
            isLoading? (          
              <Skeleton className="h-24 w-24 rounded-full z-40 mx-auto mb-2" />
            ):(
              <div className="absolute left-1/2 -top-12 transform -translate-x-1/2 w-24 h-24 z-10">
                {/* Avatar image */}
                <img
                  src={avatar}
                  alt="avatar"
                  className="w-24 h-24 rounded-full border-[6px] border-white shadow-md object-cover"
                />

                {/* Dark transparent overlay */}
                <div className="absolute inset-0 rounded-full bg-black/70 z-20"></div>

                {/* Default profile initials */}
                <div className="absolute inset-0 flex items-center justify-center text-white text-[30px] font-semibold z-30">
                  <p>{defaultProfile(username)}</p>
                </div>
              </div>
            
            )
          }
          {isLoading? ( <Skeleton className="h-4 w-[250px] z-40 mx-auto mb-2" />) : (<h2 className="text-xl font-semibold">{username}</h2>)}
          {isLoading? ( <Skeleton className="h-4 w-[200px] z-40 mx-auto mb-2" />) : (<p className="text-gray-600 text-sm">{email}</p>)}
          
          
        </div>

        {/* Divider Section with indents and dashed line */}
        <div className="relative h-6 bg-transparent">
          {/* Left Circle */}
          <div className="absolute -left-3 top-1/2 transform bg-zinc-50 -translate-y-1/2 w-6 h-6 bg-background rounded-full z-10"></div>

          {/* Right Circle */}
          <div className="absolute -right-3 top-1/2 transform bg-zinc-50 -translate-y-1/2 w-6 h-6 bg-background rounded-full z-10"></div>

          {/* Dashed Line */}
          <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-gray-400 z-0"></div>
        </div>

        {/* Bottom Section */}
        <div className="px-6 py-4 text-center rounded-b-xl bg-white/80">
          {isLoading? ( <Skeleton className="h-4 w-[150px] z-40 mx-auto mb-2" />) : (<p className="text-sm text-gray-500 mb-1 text-[20px] ">Claim Amount</p>)}
          {isLoading? ( <Skeleton className="h-4 w-[100px] z-40 mx-auto mb-2" />) : (<p className="text-2xl font-bold text-gray-800 text-[30px] ">${amount}</p>)}

          
          
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
