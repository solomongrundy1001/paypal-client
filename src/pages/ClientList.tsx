import LoaderWithCheck from "@/components/loaderCheck";
import TableComponent from "../components/TableComponent"
import axios from "axios"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface User {
  _id: number;
  username: string;
  lastname: string;
  firstname:string;
  email: string;
  avatar: string;
  amount : string
}

type Phase = "idle" | "loading" | "check" | "done";

const ClientList = () => {
  const [users, setUsers] = useState<User[]>([]) 
  const [phase, setPhase] = useState<Phase>("idle"); 

  const getUsers = async () => {
    const token = localStorage.getItem("token")
    try {
      setPhase("loading");
      const response = await axios.get("https://paypal-backend-e8c3.onrender.com/api/superuser/get-users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if(response.data?.data){
        setUsers(response.data.data)
        toast.success(response.data?.message)
      } else {
        setUsers([])
        toast.error("No users found")
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message);
        console.error("Axios error:", error.response?.data);
      } else {
        toast.error("An unexpected error occurred");
        console.error("Unexpected error:", error);
      }
    } finally {
      // ✅ Instead of going directly to "done", show the check phase
      setPhase("check");
      setTimeout(() => setPhase("done"), 1000); // 1s check mark
    }
  }

  useEffect(() => {
    const timer = setTimeout(()=> {
      getUsers();
    }, 3000 );
    return () => clearTimeout(timer)
  }, []) 

  return (
    <>
      {(phase === "loading" || phase === "check") && (
        <LoaderWithCheck phase={phase} />
      )}

      {phase === "done" && users.length === 0 && <p>No users found</p>}
      {phase === "done" && users.length > 0 && <TableComponent users={users} />}
    </>
  )
}

export default ClientList
