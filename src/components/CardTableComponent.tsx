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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { EllipsisVertical } from 'lucide-react';
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { defaultProfile } from "./defaultProfile";
import { Download } from 'lucide-react';

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

    // TO DOWNLOAD CARD
    const downloadCard = async (url: string, filename?: string): Promise<void> => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob)

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = filename || "card.png";
            document.body.appendChild(link);
            link.click()
            link.remove()
            window.URL.revokeObjectURL(blobUrl)
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(`Download failed: ${error.message}`);
            } else {
                toast.error("Download failed due to an unknown error");
            }
        }

    }

    return (
        <>
            <Table className="mt-12">
                <TableCaption>List of Cards</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-left w-1/4">Card Type</TableHead>
                        <TableHead className="text-left w-1/4">Card Number</TableHead>
                        <TableHead className="text-center w-1/4">Download Card</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((card) => {

                        return (
                            <TableRow key={card._id}>
                                <TableCell className="w-1/4 text-left">{card.card_type} </TableCell>
                                <TableCell className="w-1/4 text-left">{card.card_number}</TableCell>
                                <TableCell className="w-1/4 text-center">
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Download className="mx-auto cursor-pointer" onClick={() => downloadCard(card.card_image, `${card.card_type || "card"}.png`)} />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Download Card
                                        </TooltipContent>
                                    </Tooltip>
                                </TableCell>
                                <TableCell className=" w-1/4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <EllipsisVertical className="cursor-pointer mx-2" />
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