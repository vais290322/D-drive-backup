import React from "react";
import { Pencil, Trash2 } from "lucide-react";


const blogs = [
  {
    id: 1,
    title: "Title",
    description: "Short description",
    image: "https://images.unsplash.com/photo-1749802449762-5e428ccf9a45?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "Title",
    description: "Short description",
    image: "https://images.unsplash.com/photo-1749802449762-5e428ccf9a45?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    title: "Title",
    description: "Short description",
    image: "https://images.unsplash.com/photo-1749802449762-5e428ccf9a45?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    title: "Title",
    description: "Short description",
    image: "https://images.unsplash.com/photo-1749802449762-5e428ccf9a45?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    title: "Title",
    description: "Short description",
    image: "https://images.unsplash.com/photo-1749802449762-5e428ccf9a45?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    title: "Title",
    description: "Short description",
    image: "https://images.unsplash.com/photo-1749802449762-5e428ccf9a45?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 7,
    title: "Title",
    description: "Short description",
    image: "https://images.unsplash.com/photo-1749802449762-5e428ccf9a45?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 8,
    title: "Title",
    description: "Short description",
    image: "https://images.unsplash.com/photo-1749802449762-5e428ccf9a45?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 9,
    title: "Title",
    description: "Short description",
    image: "https://images.unsplash.com/photo-1749802449762-5e428ccf9a45?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 10,
    title: "Title",
    description: "Short description",
    image: "https://images.unsplash.com/photo-1749802449762-5e428ccf9a45?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export const DashboardBlog = () => {
  return (
    <div className="bg-white m-6 p-3 shadow-sm rounded-lg border-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Blogs</h2>
        <button className="bg-gray-300 text-black font-semibold py-2 px-4 rounded">
          New Blog
        </button>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-2">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="flex items-center bg-gray-100 rounded-md p-4"
          >
            {/* Blog Image */}
            <img
              src={blog.image}
              alt="blog"
              className="w-20 h-20 object-cover rounded-md mr-4"
            />

            {/* Blog Content */}
            <div className="flex-1">
              <h4 className="font-semibold text-md">{blog.title}</h4>
              <p className="text-sm text-gray-600">{blog.description}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center ml-4 border-l pl-4 space-y-2">
              <button className="text-black hover:text-blue-600">
                <Pencil />
              </button>
              <button className="text-black hover:text-red-600">
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


