import React, { useEffect, useState } from "react";
import Header from "../componants/Header";
import Footer from "../componants/Footer";
import legalBg from "../assets/v1-footerimage.jpg";
const API = import.meta.env.VITE_OLD_API_URL;
export const News = () => {
  const [news, setnews] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API}/api/v1/data-news`); // Adjust the API endpoint as needed
        const data = await response.json();
        setnews(data?.news || []); // Ensure data is in the expected format
        console.log("Fetched Projects:", data); // Ensure data is in the expected format
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-[49.6vh] bg-white">
        {/* Top Pattern Strip */}
        <div
          className="h-14 bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: `url(${legalBg})` }}
        ></div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-2">
            {news.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {item.content}
                  </p>

                  {/* Uncomment if needed */}
                  {/* <a
            href={item.link}
            className="inline-block text-[#8ca647] hover:underline text-sm font-semibold"
          >
            Read More →
          </a> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
