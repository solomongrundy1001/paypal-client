// import { defaultProfile } from "./defaultProfile";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EllipsisVertical } from 'lucide-react';
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { defaultProfile } from "./defaultProfile";

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
    sender_details: SenderDetails[]
}

const CardTableComponent: React.FC<{ cards: Card[] }> = ({ cards }) => {
    const [data, setData] = useState(cards)

    const deleteCard = async (id: number) => {
        const token = localStorage.getItem("token")

        const confirmAction = window.confirm("are you sure you want to perform this action?")
        if (!confirmAction) return;

        const previousData = [...data];
        setData((prev) => prev.filter((user) => user._id !== id));
        try {
            const response = await axios.delete(`https://paypal-backend-e8c3.onrender.com/api/superuser/${id}/delete-card`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.status == 200) {
                toast.success(response.data?.message)
            }

        } catch (error) {
            setData(previousData)
            const err = error as AxiosError<{ message?: string }>;
            const errorMsg = err.response?.data?.message || err.message || "An error occurred";
            toast.error(errorMsg); console.error("error occurred while deleting user", error);
        }

    }
    useEffect(() => {
        setData(cards)
    }, [cards])

    return (
        <>
            <Table className="mt-12">
                <TableCaption>List of Cards</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-left w-1/4">Card Type</TableHead>
                        <TableHead className="text-left w-1/4">Card Number</TableHead>
                        <TableHead className="text-left w-1/4">Download Card</TableHead>
                        {/* <TableHead className="text-left w-1/4">Email</TableHead> */}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((card) => {

                        return (
                            <TableRow key={card._id}>
                                <TableCell className="text-left">{card.card_type} </TableCell>
                                <TableCell className="text-left">{card.card_number}</TableCell>
                                <TableCell className="text-left flex items-center justify-between">
                                    <a href={card.card_image} download={true} >download</a>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <EllipsisVertical className="cursor-pointer" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>Sender Details</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <Avatar>
                                                    <AvatarImage src={card.sender_details[0].avatar} />
                                                    <AvatarFallback>{defaultProfile(card.sender_details[0].username)}</AvatarFallback>
                                                </Avatar>

                                            </DropdownMenuItem>
                                            <DropdownMenuItem>{card.sender_details[0].username} </DropdownMenuItem>
                                            <DropdownMenuItem>{card.sender_details[0].email} </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => deleteCard(card._id)}
                                            >
                                                Delete Card
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )

                    })}
                </TableBody>
            </Table>

        </>
    )
}

export default CardTableComponent