"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Tooltip,
} from "@material-tailwind/react";
import { Comment, ThumbUp, ThumbUpAltOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Textarea } from "@mui/joy";
import { motion } from "framer-motion";
import axios from "axios";
import useSocket from "../hooks/useSocket";
import Cookies from "js-cookie";

export default function Posts({ postData, refresh }) {
    const [isCommentActive, setComment] = useState(false);
    const [userName, setUserName] = useState("");
    const [comment, updateComment] = useState("");
    const socket = useSocket();

    async function addLike(id) {
        try {
            let res = await axios.post("/api/posts/", {
                id,
            });
            res = res.data;
            if (res?.status === 200) {
                refresh();
                alert("like added");
                socket.emit("new_post", {});
            } else {
                alert(res?.message || "something went wrong");
            }
        } catch (error) {
            console.log(error);
        }
    }
    async function addComment(id) {
        try {
            let res = await axios.put("/api/posts", {
                id,
                Comment: comment,
            });
            res = res.data;
            if (res?.status === 200) {
                refresh();
                alert("comment added successfull");
                socket.emit("new_post", {});
            } else {
                alert(res?.message || "something went wrong");
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        setUserName(Cookies.get("name"));
    }, []);
    return (
        <Card className=" bg-slate-100 overflow-hidden rounded-md hover:scale-[1.004] hover:shadow-md">
            <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="m-0 rounded-none w-full h-48"
            >
                <Image src={postData?.Image} alt="post image" fill />
            </CardHeader>
            <CardBody className="px-4 pt-2">
                <Typography
                    variant="h4"
                    color="blue-gray"
                    className="font-bold"
                >
                    {postData?.Title || "No title available"}
                </Typography>
                {!isCommentActive && (
                    <Typography
                        variant="lead"
                        color="gray"
                        className="mt-3 text-sm"
                    >
                        {postData?.Content || "no description available"}
                    </Typography>
                )}
            </CardBody>
            <CardFooter className="flex px-4 items-center w-full overflow-hidden justify-between">
                <div className="flex items-center space-x-3">
                    {/* like and comment section */}
                    <div className="flex items-center space-x-3 py-2">
                        <span className="rounded-full size-6 flex justify-center items-center ring-slate-500 ring-2">
                            {postData?.Likes?.some(
                                (item) => item === userName
                            ) ? (
                                <ThumbUp className="size-4 text-green-400" />
                            ) : (
                                <ThumbUpAltOutlined
                                    onClick={(e) => addLike(postData?._id)}
                                    className="size-4"
                                />
                            )}
                        </span>
                        <p className="text-sm pr-3">
                            {postData?.Likes?.length || 0}
                        </p>
                        <span
                            onClick={(e) => setComment((prev) => !prev)}
                            className={` ${
                                isCommentActive
                                    ? " space-x-2 px-3 font-semibold text-red-400 ring-red-200"
                                    : "size-6 ring-slate-200"
                            } rounded-full ml-3 flex justify-center items-center  ring-2`}
                        >
                            <Comment className="size-4" />
                            {isCommentActive && <p>close</p>}
                        </span>
                        {!isCommentActive && (
                            <p className="text-sm">
                                {(postData?.Comments || []).length}
                            </p>
                        )}
                    </div>
                </div>
                <Typography className=" text-sm font-semibold ">
                    {(
                        new Date(postData?.createdAt) || new Date()
                    ).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    })}
                </Typography>
            </CardFooter>

            <motion.div
                initial={{ height: 0 }}
                animate={{ height: isCommentActive ? 250 : 0 }}
                transition={{ duration: 0.5 }}
                className="px-4"
            >
                <Typography
                    variant="h5"
                    color="blue-gray"
                    className="text-sm py-2"
                >
                    Comments:
                </Typography>
                <div className="flex pb-2 space-x-2 ">
                    <Textarea
                        size="md"
                        className="w-full"
                        name="Size"
                        value={comment}
                        onChange={(e) => updateComment(e.target.value)}
                        maxRows={2}
                        placeholder="Add comments"
                    />
                    <div className="flex justify-end">
                        <Button
                            onClick={(e) => addComment(postData?._id)}
                            type="button"
                            className="bg-green-400 text-xs font-bold"
                            variant="outlined"
                        >
                            Done
                        </Button>
                    </div>
                </div>
                {/* previous comments */}
                <div className="p-2 space-y-2 h-40 overflow-auto">
                    {postData?.Comments.map((comment, idx) => (
                        <Comments key={`comment-${idx}`} data={comment} />
                    ))}
                </div>
            </motion.div>
        </Card>
    );
}

function Comments({ data }) {
    return (
        <div className=" p-2 flex flex-col rounded-md ring-1  justify-center space-x-2 space-y-1 shadow-sm ">
            {/* <Avatar>A</Avatar> */}
            <div className="flex px-2 space-x-1 items-center">
                <Typography
                    variant="h5"
                    className="font-semibold text-gray-600"
                >
                    {data?.UserName}
                </Typography>
            </div>
            <Typography
                variant="h6"
                className="text-xs px-4 text-gray-600 font-normal"
            >
                {data?.Comment}
            </Typography>
        </div>
    );
}
