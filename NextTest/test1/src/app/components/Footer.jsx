'use client'

import Link from "next/link"

const Footer = () => {
  return (
    <div>
        
        <div className="flex gap-4 font-bold text-xl justify-center underline bottom-0 w-full p-4 bg-cyan-500 text-white">
            <Link href="/" className="hover:text-cyan-700" >Home</Link>
            <Link href="/about" className="hover:text-cyan-700" >About</Link>
            <Link href="/contact" className="hover:text-cyan-700" >Contact</Link>
            <Link href="/blog" className="hover:text-cyan-700" >Blog</Link>
            <Link href="/login" className="hover:text-cyan-700" >Login</Link>
            <Link href="/register" className="hover:text-cyan-700" >Register</Link>
            <Link href="/profile" className="hover:text-cyan-700" >Profile</Link>
            <Link href="/dashboard" className="hover:text-cyan-700" >Dashboard</Link>
        </div>

    </div>
  )
}

export default Footer