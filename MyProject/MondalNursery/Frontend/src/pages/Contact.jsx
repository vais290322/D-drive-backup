import React from 'react'

const Contact = () => {
  return (
    <div className='flex flex-col '>
      
      <h2 className="font-bold text-3xl text-center mt-8 " style={{marginBottom:"4rem"}}>feel free to contact us</h2>
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.5047411352125!2d88.40843097435281!3d22.560217933425893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02742d8bc14479%3A0xc178d80fd958e825!2sGovernment%20College%20of%20Engineering%20and%20Leather%20Technology!5e0!3m2!1sen!2sin!4v1717897352274!5m2!1sen!2sin" width="100%" height="300" style={{border:0}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

      <div className="container mt-6 m-auto">
        <div className="">
          <form action="https://formspree.io/f/maygkjww" method="POST" className="flex flex-col gap-4 justify-center align-middle">
            <input type="text" name="username" placeholder="username" autoComplete="off" required  className='p-3 border rounded border-red-400'/>

            <input type="email" name="email" placeholder="email" autoComplete="off" required  className='p-3 border rounded border-red-400 '/>

            <textarea name="message" cols="30" rows="10" autoComplete="off" required placeholder='enter your massage' className='p-2 border border-red-400'></textarea>

            {/* <input type="submit" value="send" className='bg-red-400 rounded-full border text-white font-medium text-lg cursor-pointer hover:bg-red-700 w-32 h-10  mb-8' /> */}
            <button type='submit' value="send" className='bg-red-400 rounded-full border text-white font-medium text-lg cursor-pointer hover:bg-red-700 w-32 h-10  mb-8'>
                Send
            </button>
           
          </form>
        </div>
      </div>
    
    </div>
  )
}

export default Contact
