import libraryUrlApi from '@/common/library';
import { Button } from '@/components/ui/button'
import { useTheme } from '@/context/ThemeContext';
import axios from 'axios';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const ReturnBookPage = () => {
    const { theme } = useTheme();
    const schoolId = useSelector((state) => state?.auth?.schoolId);
    const [input, setInput] = useState({
        bookNumber: "",
        studentId: "",
      });
      // console.log("input: ", input);
    const returnBook = async (e) => {
        e.preventDefault();
       try {
        const response = await axios.post(
          `${libraryUrlApi.returnBook.url}/${schoolId}`,
          input,
          { headers: { "Content-Type": "application/json" } }
        );
       
        if (response) {
          // console.log("Response: ", response);
          setInput({
            bookNumber: "",
            studentId: "",
          });
          toast.success(response?.data?.message || "Book returned successfully");
        }
       } catch (error) {
        toast.error(error.response?.data?.message || "Error returning book");
       }
    }



  return (
    <div className={` ${
        theme === "light" ? "dark" : "light"
      } font-poppins h-[100vh] `}>
        <div className="text-3xl font-bold text-center mt-4">Return Book</div>
        <div className='flex flex-col justify-center items-center gap-5 sm:h-[50%] h-[40%] min-w-[50%]  '>
            <form onSubmit={returnBook}>
                <div className={` rounded-md  shadow-md p-5 flex flex-col gap-5 ${theme === "light" ? "bg-[#212121]" : "bg-white"}`}> 
                <div className='flex flex-col sm:flex-row gap-5'>
                    <label htmlFor="bookNumber" className='mt-2'>Book's Number</label>
                    <input required type="text" name="bookNumber" id="bookNumber" value={input.bookNumber} onChange={(e) => setInput({ ...input, bookNumber: e.target.value })} className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md"/>
                </div>
                <div className='flex flex-col sm:flex-row gap-2 sm:gap-11'>
                    <label htmlFor="studentId" className='mt-2'>Student's Id</label>
                    <input required type="text" name="studentId" id="studentId" value={input.studentId} onChange={(e) => setInput({ ...input, studentId: e.target.value })} className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md"/>
                </div>
                <Button type="submit" className="bg-[#452B90] hover:bg-[#c29732]" >Submit</Button>
                </div>
            </form>
        </div>

    </div>
  )
}

export default ReturnBookPage