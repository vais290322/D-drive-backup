"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Blogdetails = () => {
  const par = useParams();
  // console.log("parms : ", par);
  const [post, setPost] = useState();

  const fetchAllpost = async () => {
    const posttest = await fetch(
      "https://jsonplaceholder.typicode.com/posts/" + par.id,
    );
    const post = await posttest.json();
    setPost(post);
  };

  useEffect(() => {
    fetchAllpost();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border hover:shadow-xl transition duration-300">
      <h2 className="text-xl font-semibold text-blue-600 mb-3           cursor-pointer">
        {post?.title}
      </h2>
      <p className="text-gray-600">{post?.body}</p>
    </div>
  );
};

export default Blogdetails;
