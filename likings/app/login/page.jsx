"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@mui/material";

export default function Page() {
    const [UserName, setUserName] = useState("");

    const router = useRouter();

    async function Login() {
        try {
            let res = await axios.post("/api/access/login", { UserName });
            res = res?.data;
            if (res?.status === 200) {
                alert("Log in successful!");
                router.push("/home");
            } else {
                alert(res?.message || "something went wrong");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <section className="h-screen w-screen bg-blue-400 flex justify-center items-center">
            <div className="w-3/4 rounded-md shadow-md bg-slate-200 p-8 flex flex-col space-y-4">
                <h2>Login.</h2>
                <div className="flex flex-col">
                    <Input
                        value={UserName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="user name"
                        variant="outlined"
                    />
                    <Button
                        onClick={Login}
                        type="button"
                        variant="outlined"
                        className="mt-8"
                    >
                        Login
                    </Button>
                </div>
                <div>
                    <Link className="text-blue-500" href={"/signup"}>
                        create an account.
                    </Link>
                </div>
            </div>
        </section>
    );
}
