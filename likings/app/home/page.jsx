"use client";
import React, { useEffect, useState } from "react";
import ResponsiveAppBar from "../Components/Header";
import Post from "../Components/post";
import { Grid } from "@mui/material";
import { Add } from "@mui/icons-material";
import axios from "axios";
import { motion } from "framer-motion";
import useSocket from "../hooks/useSocket";
import Newpost from "../Components/newPost";
import Cookies from "js-cookie";

export default function Page() {
    const [isNewPopupActive, newPost] = useState(false);
    const [posts, setPosts] = useState([]);
    const socket = useSocket();
    const gatherPosts = async () => {
        try {
            let res = axios.get("/api/posts/getAllPosts");
            res = (await res).data;
            if (res?.status === 200) {
                setPosts(res?.data || []);
            } else {
                alert("no posts available currently");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        gatherPosts();
    }, []);
    useEffect(() => {
        if (socket) {
            socket.on("new_post", () => {
                gatherPosts();
            });
        }
    }, []);

    return (
        <main className="h-full relative">
            <ResponsiveAppBar />
            {/* main contents */}
            <section className="bg-blue-100 relative p-8 space-x-3 space-y-4 pt-[6rem] overflow-scroll flex flex-wrap justify-center h-screen w-full">
                <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 1, sm: 8, md: 12 }}
                >
                    {posts.map((post, index) => (
                        <Grid item xs={1} sm={4} md={4} key={post?._id}>
                            <Post refresh={gatherPosts} postData={post} />
                        </Grid>
                    ))}
                </Grid>

                <motion.div
                    onClick={(e) => newPost(true)}
                    layoutId="12"
                    className="fixed rounded-full text-white bg-blue-400 bottom-8
                right-4 size-16 flex justify-center items-center"
                >
                    <Add className="size-10" />
                </motion.div>
            </section>
            {isNewPopupActive && (
                <Newpost refresh={gatherPosts} newPost={newPost} />
            )}
        </main>
    );
}
