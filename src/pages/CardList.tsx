import LoaderWithCheck from "@/components/loaderCheck";
import axios from "axios"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import CardTableComponent from "@/components/CardTableComponent";

interface SenderDetails {
    username: string;
    email: string;
    avatar: string;
}

interface Card {
    _id: number;
    card_type: string;
    card_number: string;
    card_image: string;
    sender_details : SenderDetails[]
}

type Phase = "idle" | "loading" | "check" | "done";

const CardList = () => {
    const [cards, setCards] = useState<Card[]>([]) 
    const [phase, setPhase] = useState<Phase>("idle"); 

      const getCards = async () => {
    const token = localStorage.getItem("token")
    try {
      setPhase("loading");
      const response = await axios.get("https://paypal-backend-e8c3.onrender.com/api/superuser/get-cards", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if(response.data?.data){
        setCards(response.data.data)
        toast.success(response.data?.message)
      } else {
        setCards([])
        toast.error("No card found")
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
      getCards();
    }, 3000 );
    return () => clearTimeout(timer)
  }, []) 

  return (
    <>
    {(phase === "loading" || phase === "check") && (<LoaderWithCheck phase={phase} />)}
    {phase === "done" && cards.length === 0 && <p>No users found</p>}
    {phase === "done" && cards.length > 0 && <CardTableComponent cards={cards} />}
    </>
  )
}

export default CardList