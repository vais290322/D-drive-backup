import React, { useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { FaPlus } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import axios from 'axios';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react';




const StaffRole = () => {

  const [lodaing, setLodaing] = useState(false);
  const [staffloading, setStaffloading] = useState(false);
  const [staffType, setStaffType] = useState("");

  const changeEventHandler = (e) => {
    setStaffType(e.target.value);
  }

  console.log("staff type : ", staffType)

  const fetchStuffRole = async () => {

    try {
      setLodaing(true);
      const response = await axios.get("url", {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })

      console.log("response : ", response)
    } catch (error) {
      toast.error(error.response.data.message);
    }







  }

  const addNewStaffRole = async (e) => {
    e.preventDefault();

    try {
      setStaffloading(true);
      const response = await axios.post("url", { staffType }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log("response : ", response);

      if (response.success) {
        setStaffType("");
      }

    } catch (error) {
      toast.error(error.response.data.message);
    }
    finally {
      setStaffloading(false)
    }


  }


  return (
    <div className='mt-4 font-poppins border '>
      <h2 className='bg-white flex justify-between items-center p-6 border-b ' >

        <div>
          <span  >Staff Type</span>
        </div>

        {/* for addStuff  */}
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="text-white  bg-[#452B90] hover:bg-[#352072] "> <span><FaPlus /></span> Add Stuff Type</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[30%]">
              <DialogHeader>
                <DialogTitle>Create Staff Type</DialogTitle>
                <DialogDescription>
                  Add new stuff Type. Click save when you're done.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={addNewStaffRole} >
                <div className="grid gap-4 py-4">

                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="staffType" className="text-left">
                      Stuff Type Name <sup className='text-red-600'>*</sup>
                    </Label>
                    <Input required id="staffType" name="staffType" className="col-span-3" value={staffType} onChange={changeEventHandler} />
                  </div>

                </div>
                <DialogFooter>
                {
                    staffloading ? (
                      <Button className="bg-[#452B90] hover:bg-[#352072]" >
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        please wait ...
                      </Button>
                    ) : (<Button type="submit" className="bg-[#452B90] hover:bg-[#352072]" >Save</Button>)
                  }

                </DialogFooter>
              </form>

            </DialogContent>
          </Dialog>
        </div>
      </h2>

      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-[#312A2A] ">S.No</TableHead>
            <TableHead className="text-center text-[#312A2A] ">Staff Type</TableHead>
            <TableHead className="text-right text-[#312A2A] ">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

          <TableRow>
            <TableCell className="font-medium text-[#97978C] ">7</TableCell>
            <TableCell className="text-center text-[#97978C] ">Admin</TableCell>

            <TableCell className=" text-right">

              <div className='flex justify-end items-center gap-2 '>

                <FaEdit className='w-7 h-7 bg-[#FF9F00] text-white p-1 cursor-pointer rounded-sm' />
                <IoMdClose className='w-7 h-7 bg-[#FF5E5E] text-white p-1 cursor-pointer rounded-sm' />


              </div>

            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">8</TableCell>
            <TableCell className="text-center">Admin</TableCell>
            <TableCell className=" text-right">

              <div className='flex justify-end items-center gap-2 '>
                <FaEdit className='w-7 h-7 bg-[#FF9F00] text-white p-1 cursor-pointer rounded-sm' />
                <IoMdClose className='w-7 h-7 bg-[#FF5E5E] text-white p-1 cursor-pointer rounded-sm' />
              </div>

            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">11</TableCell>
            <TableCell className="text-center" >In House Staff</TableCell>
            <TableCell className=" text-right">

              <div className='flex justify-end items-center gap-2 '>
                <FaEdit className='w-7 h-7 bg-[#FF9F00] text-white p-1 cursor-pointer rounded-sm' />
                <IoMdClose className='w-7 h-7 bg-[#FF5E5E] text-white p-1 cursor-pointer rounded-sm' />
              </div>

            </TableCell>
          </TableRow>


        </TableBody>
      </Table>
    </div>
  )
  
}

export default StaffRole