"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {

   const pathName = usePathname();
   console.log("path name ", pathName)

     const linkClass = (path) =>
    pathName === path
      ? "text-yellow-300 underline"
      : "hover:text-cyan-700";


  return (
    <div className="bg-cyan-500 text-white p-4 flex gap-4 font-bold text-xl justify-center underline  ">
      <Link href="/"  >Logo</Link>
      <Link href="/" className={linkClass("/")} >Home</Link>
      <Link href="/about" className={linkClass("/about")} >About</Link>
      <Link href="/contact" className={linkClass("/contact")} >Contact</Link>
      <Link href="/blog" className={linkClass("/blog")} >Blog</Link>
      <Link href="/login" className={linkClass("/login")} >Login</Link>
      <Link href="/register" className={linkClass("/register")} >Register</Link>
      <Link href="/profile" className={linkClass("/profile")} >Profile</Link>
      <Link href="/dashboard" className={linkClass("/dashboard")} >Dashboard</Link>
    </div>
  );
};

export default Header;
