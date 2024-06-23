"use client";
import { Button, Input } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Page() {
    const [UserName, setUserName] = useState("");
    const router = useRouter();
    async function Signup() {
        try {
            let res = await axios.post("/api/access/signup", { UserName });
            res = res?.data;
            if (res?.status === 200) {
                alert("Sign up successful!");
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
                <h2>Signup.</h2>
                <div className="flex flex-col">
                    <Input
                        value={UserName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="user name"
                        variant="outlined"
                    />
                    <Button
                        onClick={Signup}
                        type="button"
                        variant="outlined"
                        className="mt-8"
                    >
                        Signup
                    </Button>
                </div>
                <div>
                    <Link className="text-blue-500" href={"/login"}>
                        Have an account login.
                    </Link>
                </div>
            </div>
        </section>
    );
}
