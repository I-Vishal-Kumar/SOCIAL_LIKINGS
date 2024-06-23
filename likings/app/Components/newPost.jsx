import { Close } from "@mui/icons-material";
import { Textarea } from "@mui/joy";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useState } from "react";
import ImageUploading from "react-images-uploading";
import useSocket from "../hooks/useSocket";

async function get64encoding(file) {
    try {
        if (file) {
            let image = file[0];
            if (!image) {
                alert("no file choosen");
                return false;
            }
            return image?.data_url || false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

export default function Newpost({ newPost, refresh }) {
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [creating, setCreating] = useState(false);
    const maxNumber = 1;
    const maxFileSize = 5_000_000;
    const socket = useSocket();

    const onChange = (imageList, addUpdateIndex) => setImages(imageList);

    // format the date in dd XXX YYY format
    function getDate() {
        const options = { day: "numeric", month: "short", year: "numeric" };
        return new Date().toLocaleDateString("en-US", options);
    }

    async function createPost() {
        try {
            let file = images;
            let base64Data = await get64encoding(file);
            if (!base64Data) alert("no file is choosen");
            else {
                setCreating(true);
                let res = await axios.post("/api/posts/newPost", {
                    title,
                    description,
                    image: base64Data,
                });
                res = res.data;
                if (res.status === 200) {
                    setCreating(false);
                    alert("post created");
                    socket.emit("new_post", {});
                    refresh();
                    newPost(false);
                } else {
                    setCreating(false);
                    alert(res?.message || "something went wrong");
                }
            }
        } catch (error) {
            setCreating(false);
            console.log(error);
        }
    }

    return (
        <section className="absolute top-0 left-0 flex justify-center items-center bg-slate-600/30 h-full w-full pt-20 text-black">
            <motion.div
                layoutId="12"
                className="h-4/5 w-4/5 space-y-4 bg-slate-200 rounded-md p-4"
            >
                <div
                    onClick={(e) => newPost(false)}
                    className="w-full font-bold flex justify-between "
                >
                    <h2>Create a new post.</h2>
                    <Close />
                </div>
                <section className="flex flex-col ">
                    {/* upload sectioin */}
                    <div className="flex-[1]">
                        <div className="w-full ring-1 rounded-md ring-blue-300 overflow-hidden shadow-md">
                            <ImageUploading
                                multiple
                                value={images}
                                onChange={onChange}
                                maxNumber={maxNumber}
                                maxFileSize={maxFileSize}
                                dataURLKey="data_url"
                                acceptType={["jpg", "png", "svg"]}
                            >
                                {({
                                    imageList,
                                    onImageUpload,
                                    onImageRemoveAll,
                                    onImageUpdate,
                                    onImageRemove,
                                    isDragging,
                                    dragProps,
                                }) => (
                                    // write your building UI
                                    <div className=" flex flex-col items-center pb-4 justify-center space-y-4 overflow-hidden  upload__image-wrapper w-full">
                                        <button
                                            style={
                                                isDragging
                                                    ? { color: "red" }
                                                    : null
                                            }
                                            onClick={onImageUpload}
                                            className="bg-blue-400 text-white w-full py-2 font-semibold capitalize"
                                            {...dragProps}
                                        >
                                            {images.length === 0
                                                ? "Click or Drop here"
                                                : "update image"}
                                        </button>
                                        {imageList.map((image, index) => (
                                            <div
                                                key={index}
                                                className="image-item max-h-[200px] overflow-scroll"
                                            >
                                                <img
                                                    src={image.data_url}
                                                    alt=""
                                                    width="200"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ImageUploading>
                        </div>
                    </div>
                    {/* description */}
                    <div className="flex-[3] h-full flex flex-col items-center py-2 justify-between space-y-4">
                        {/* date */}
                        <div className="text-sm text-gray-700 flex justify-end w-full  items-center">
                            <p>{getDate()}</p>
                        </div>
                        <div className="w-full ">
                            <Textarea
                                size="md"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full capitalize font-semibold"
                                name="Size"
                                maxRows={2}
                                placeholder="Enter a title"
                            />
                        </div>
                        <Textarea
                            size="md"
                            name="size"
                            className="w-full"
                            maxRows={5}
                            minRows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter a description"
                        />
                        <button
                            onClick={createPost}
                            type="button"
                            className="bg-blue-400 w-full text-white uppercase font-semibold text-sm px-8 py-2 rounded-md"
                        >
                            {creating ? "Creating ...." : "create"}
                        </button>
                    </div>
                </section>
            </motion.div>
        </section>
    );
}
