import React from "react";
// import CEODK from "../assest/logo/CEODK1.jpg";
import profile1 from "../assest/logo/profile1.jpg";
import profile2 from "../assest/logo/profile2.jpg";


const About = () => {
  return (
    <div>
      <div className="bg-white text-gray-900">
        <header className=" text-center py-6">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl font-bold">About Us</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-16">
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-lg">
              Welcome to{" "}
              <span className="font-bold text-black"> JR Mondal Nursery’s</span>{" "}
              where nurturing little minds and hearts is our passion. Our
              journey began with a simple vision: to create a warm, inspiring,
              and safe environment where children can thrive, grow, and discover
              the joy of learning.
              <span className="font-bold text-black">
                {" "}
                JR Mondal Nursery’s
              </span>{" "}
              envisioned a place where every child is celebrated for their
              unique potential and encouraged to explore the world around them
              with curiosity and confidence. From humble beginnings, we have
              grown into a vibrant community of educators, parents, and
              children, all working together to create a nurturing and inclusive
              space. Our team of dedicated professionals brings a wealth of
              experience and a shared commitment to fostering creativity,
              independence, and a lifelong love of learning. At
              <span className="font-bold text-black">
                {" "}
                JR Mondal Nursery’s
              </span>{" "}
              we believe in the power of play, exploration, and meaningful
              connections. Our carefully designed curriculum blends structured
              activities with child-led discovery, ensuring that every child’s
              developmental milestones are met in a way that feels natural and
              joyful. We are more than a nursery – we are a family. Whether it’s
              celebrating milestones, supporting individual needs, or partnering
              with parents to build strong foundations for the future, we are
              proud to be part of each child’s journey.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg">
              At{" "}
              <span className="font-bold text-black"> JR Mondal Nursery’s</span>{" "}
              our mission is to provide a nurturing, inspiring, and inclusive
              environment where every child feels safe, valued, and supported.
             <span className="font-bold text-black"> We are dedicated to: </span>  Fostering Growth: Encouraging each child to
              explore, learn, and grow at their own pace, while meeting key
              developmental milestones. Nurturing Creativity: Cultivating
              imagination and self-expression through play, exploration, and
              hands-on learning experiences. Building Confidence: Empowering
              children to develop independence, resilience, and a strong sense
              of self-worth. Creating Connections: Establishing meaningful
              relationships with children, families, and the wider community to
              create a supportive network. Celebrating Diversity: Embracing and
              respecting each child’s unique background, culture, and
              individuality.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-4">Meet the Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <img
                  src={profile1}
                  alt="Team Member"
                  className="rounded-full mx-auto mb-4 h-40 w-40"
                />
                <h3 className="text-xl font-semibold">Jakir Hossan Mondal</h3>
                <p className="text-gray-700">Founder & CEO</p>
              </div>
              <div className="text-center">
                <img
                  src={profile2}
                  alt="Team Member"
                  className="rounded-full mx-auto mb-4 h-40 w-40 "
                />
                <h3 className="text-xl font-semibold">Aniket Dey</h3>
                <p className="text-gray-700">Chief Marketing Officer</p>
              </div>
              {/* <div className="text-center">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Team Member"
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold">Mike Johnson</h3>
                <p className="text-gray-700">Head of Customer Support</p>
              </div> */}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Our Services</h2>
            <ul className="list-disc list-inside text-lg">
              <li>Wide range of high-quality products</li>
              <li>Affordable prices</li>
              <li>Fast and reliable shipping</li>
              <li>Exceptional customer service</li>
              <li>Easy returns and exchanges</li>
            </ul>
          </section>
        </main>
        <footer className="bg-gray-200 py-6">
          <div className="container mx-auto px-6 text-center">
            <p>
              &copy; {new Date().getFullYear()} JR Mondal Nursery Online Services.
              All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default About;
