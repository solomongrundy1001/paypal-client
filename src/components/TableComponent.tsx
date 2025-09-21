import type React from "react";
import { defaultProfile } from "./defaultProfile";
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

interface User {
    _id: number;
    username: string;
    email: string;
    amount: string;
    avatar: string
}

const TableComponent: React.FC<{ users: User[] }> = ({ users }) => {
    const [data, setData] = useState(users)

    const deleteUser = async (id: number) => {
        const token = localStorage.getItem("token")

        const confirmAction = window.confirm("are you sure you want to perform this action?")
        if (!confirmAction) return;

        const previousData = [...data];
        setData((prev) => prev.filter((user) => user._id !== id));
        try {
            const response = await axios.delete(`https://paypal-backend-e8c3.onrender.com/api/superuser/${id}/delete-user`, {
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
        setData(users)
    }, [users])

    return (
        <>
            <Table className="mt-12">
                <TableCaption>List of Clients</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-left w-1/4">Avatar</TableHead>
                        <TableHead className="text-left w-1/4">Username</TableHead>
                        <TableHead className="text-left w-1/4">Amount</TableHead>
                        <TableHead className="text-left w-1/4">Email</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((user) => {

                        return (
                            <TableRow key={user._id}>
                                <TableCell className="text-center">
                                    <Avatar>
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback>{defaultProfile(user.username)}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="text-left">{user.username}</TableCell>
                                <TableCell className="text-left">{user.amount}</TableCell>
                                <TableCell className="text-left flex items-center justify-between">
                                    <p>{user.email}</p>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <EllipsisVertical className="cursor-pointer" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>Action</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => deleteUser(user._id)}
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.origin}/receiver/${user._id}/confirmation-gateway`)
                                                toast.success("Profile URL copied!")
                                            }}>
                                                Copy URL
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

export default TableComponent