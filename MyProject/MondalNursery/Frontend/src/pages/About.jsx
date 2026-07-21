import React from 'react'
import CEODK from "../assest/logo/CEODK1.jpg"

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
            Welcome to DK-Ecommerce Online Services! We are a passionate team dedicated to bringing you the best online shopping experience. Our journey began with a simple idea: to provide high-quality products at affordable prices, all while offering exceptional customer service.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg">
            Our mission is to become your go-to destination for all your shopping needs. We strive to offer a diverse range of products that cater to your lifestyle, all backed by our commitment to quality and customer satisfaction.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img src={CEODK} alt="Team Member" className="rounded-full mx-auto mb-4 h-40 w-40"/>
              <h3 className="text-xl font-semibold">DK</h3>
              <p className="text-gray-700">Founder & CEO</p>
            </div>
            <div className="text-center">
              <img src="https://via.placeholder.com/150" alt="Team Member" className="rounded-full mx-auto mb-4"/>
              <h3 className="text-xl font-semibold">Jane Smith</h3>
              <p className="text-gray-700">Chief Marketing Officer</p>
            </div>
            <div className="text-center">
              <img src="https://via.placeholder.com/150" alt="Team Member" className="rounded-full mx-auto mb-4"/>
              <h3 className="text-xl font-semibold">Mike Johnson</h3>
              <p className="text-gray-700">Head of Customer Support</p>
            </div>
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
          <p>&copy; {new Date().getFullYear()} DK-Ecommerce Online Services. All rights reserved.</p>
        </div>
      </footer>
    </div>
    </div>
  )
}

export default About
