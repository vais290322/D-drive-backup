'use client'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from 'react'

const Blog = () => {
    const [post, setPost] = useState();
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [limit, setLimit] = useState(10)

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(e.target.value)
        setPage(1)
    }

    // console.log(search)

    const fetchAllpost = async () => {
        const posttest = await fetch("https://jsonplaceholder.typicode.com/posts");
        const post = await posttest.json();
        setPost(post);
    }

    useEffect(() => {
        fetchAllpost();
    }, [])

    const filteredPost = post?.filter((item) => {
        return item.title.toLowerCase().includes(search.toLowerCase())

    })

    useEffect(() => {
        if (filteredPost) {
            setTotalPage(Math.ceil(filteredPost.length / limit));
        }
    }, [filteredPost, limit]);

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const currentPost = filteredPost?.slice(startIndex, endIndex)

    const getPagination = () => {
        const delta = 1; // pages around current page
        const range = [];
        const rangeWithDots = [];
        let last;

        for (let i = 1; i <= totalPage; i++) {
            if (
                i === 1 ||
                i === totalPage ||
                (i >= page - delta && i <= page + delta)
            ) {
                range.push(i);
            }
        }

        for (let i of range) {
            if (last) {
                if (i - last === 2) {
                    rangeWithDots.push(last + 1);
                } else if (i - last !== 1) {
                    rangeWithDots.push("...");
                }
            }

            rangeWithDots.push(i);
            last = i;
        }

        return rangeWithDots;
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <h1 className="text-4xl font-bold text-center text-cyan-600 mb-8">
                Blog Posts
            </h1>

            <div className="flex justify-center mb-6">

                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="search blog..."
                    className="border p-2 rounded-md w-64"
                />
                {/* <button className="bg-cyan-600 text-white px-4 rounded-r-md"> search </button> */}


            </div>
            {filteredPost?.length === 0 ? (
                <p className="text-center text-gray-500">No posts found.</p>
            ) : null}

            <p className="text-center text-gray-500">Total posts: {filteredPost?.length} </p>

            {currentPost?.map((item, index) => (
                <div
                    key={item.id}
                    className="bg-white shadow-md rounded-lg p-6 border hover:shadow-xl transition duration-300"
                >
                    <p className="text-sm text-gray-400 mb-1">Post #{(page - 1) * limit + index + 1}</p>




                    <Link href={`/blog/${item.id}`} >
                        <h2 className="text-xl font-semibold text-blue-600 mb-3 hover:underline cursor-pointer">
                            {item.title}
                        </h2>
                    </Link>
                    <p className="text-gray-600 leading-relaxed">{item.body}</p>
                </div>
            ))}

            <div className="flex justify-between mt-6">

                <div className=" ">
                    <select
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="border p-2 rounded-md"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
                <div>
                    <Button
                        onClick={() => setPage((prev) => prev - 1)}
                        disabled={page === 1}
                        className="bg-cyan-600 text-white px-4 rounded-md mr-2 cursor-pointer hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Previous
                    </Button>
                    {getPagination().map((item, index) =>
                        item === "..." ? (
                            <span key={index} className="px-2">
                                ...
                            </span>
                        ) : (
                            <Button 
                                key={index}
                                onClick={() => setPage(item)}
                                className={`px-3 py-1 cursor-pointer rounded-md hover:bg-amber-600 ${page === item ? "bg-cyan-600 text-white" : "bg-gray-200"
                                    }`}
                            >
                                {item}
                            </Button>
                        )
                    )}

                    <Button
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={page === totalPage}
                        className="bg-cyan-600 text-white px-4 rounded-md cursor-pointer ml-2 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Blog;