import React from 'react'
import About_Home_Image from '../../../../assets/Home_images/about page/home.png'
import Header from '../../Header'
import Button from '../../Others/Button'
import ImageGallary from '../Gallary/ImageGallary'
import AssociatePartner from './AssociatePartner'
import TrustedByBusiness from '../Home/TrustedByBusiness'
import DiscoverTheDifference from '../Home/DiscoverTheDifference'
import Footer from '../../Footer'

function About() {
  return (
    <>
      <div className='h-screen w-full bg-cover text-white mb-32' style={{backgroundImage:`url(${About_Home_Image})`}}>
      <Header />
      <div className="max-w-3xl px-6 sm:px-12 md:px-32 pt-40 sm:pt-48 md:pt-64">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold">
          Security Services <br /> Your Shield of <br />
          <span className="font-bold text-white">Protection</span>
        </h1>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-10">
          At MNS Secure Solutions Pvt Ltd, we provide comprehensive security and
          manpower services designed to keep your business and home safe,
          secure, and efficiently managed.
        </p>
        <Button title="Read More →" />
        </div>
      </div>
      <ImageGallary />
      <AssociatePartner />
      <TrustedByBusiness />
      <DiscoverTheDifference />
      <Footer/> 
    </>
  )
}

export default About