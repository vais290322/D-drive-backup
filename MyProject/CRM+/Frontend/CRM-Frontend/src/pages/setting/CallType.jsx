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

const CallType = () => {

  const [lodaing, setLodaing] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const [call_type, setCall_type] = useState("");

  const changeEventHandler = (e) => {
    setService_type_name(e.target.value);
  }

  console.log("Call type : ", call_type)

  const fetchCallType = async () => {

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

  const addNewCallType = async (e) => {
    e.preventDefault();

    try {
      setPostApiLoading(true);
      const response = await axios.post("url", { call_type }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log("response : ", response);

      if (response.success) {
        setService_type_name("");
      }

    } catch (error) {
      toast.error(error.response.data.message);
    }
    finally {
      setPostApiLoading(false)
    }


  }



  return (
    <div className='mt-4 font-poppins border '>
    <h2 className='bg-white flex justify-between items-center p-3 sm:p-6 border-b ' >

      <div>
        <span  >Call Type</span>
      </div>

      {/* for addService type buton  */}
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="text-white  bg-[#452B90] hover:bg-[#352072] "> <span className='hidden sm:block'><FaPlus /></span> Add Call Type</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[30%] max-w-[80%]">
            <DialogHeader>
              <DialogTitle>Create Call Type</DialogTitle>
              <DialogDescription>
                Add new call type. Click save when you're done.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={addNewCallType} >
              <div className="grid gap-4 py-4">

                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="call_type" className="text-left">
                    Call Type Name <sup className='text-red-600 hidden sm:inline '>*</sup>
                  </Label>
                  <Input required id="call_type" name="call_type" className="col-span-3" value={setCall_type} onChange={changeEventHandler} />
                </div>

              </div>
              <DialogFooter>

                {
                  postApiLoading ? (
                    <Button className="bg-[#452B90] hover:bg-[#352072]" >
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      please wait...
                    </Button>
                  ) : (<Button type="submit" className="bg-[#452B90] hover:bg-[#352072]" >Save</Button>)
                }



              </DialogFooter>
            </form>

          </DialogContent>
        </Dialog>
      </div>
    </h2>

    <Table >
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] text-[#312A2A] ">S.No</TableHead>
          <TableHead className="text-center text-[#312A2A] ">Call Type</TableHead>
          <TableHead className="text-right text-[#312A2A] ">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>

        <TableRow>
          <TableCell className="font-medium text-[#97978C] ">1</TableCell>
          <TableCell className="text-center text-[#97978C] ">Hot Call</TableCell>

          <TableCell className=" text-right">

          <div className='flex justify-end items-center gap-2 '>
              <FaEdit className='sm:w-7 sm:h-7 w-5 h-5 bg-[#FF9F00] text-white p-1 cursor-pointer rounded-sm' />
              <IoMdClose className='sm:w-7 sm:h-7 w-5 h-5 bg-[#FF5E5E] text-white p-1 cursor-pointer rounded-sm' />
            </div>

          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-medium">2</TableCell>
          <TableCell className="text-center">Busy Number</TableCell>
          <TableCell className=" text-right">

            <div className='flex justify-end items-center gap-2 '>
              <FaEdit className='sm:w-7 sm:h-7 w-5 h-5 bg-[#FF9F00] text-white p-1 cursor-pointer rounded-sm' />
              <IoMdClose className='sm:w-7 sm:h-7 w-5 h-5 bg-[#FF5E5E] text-white p-1 cursor-pointer rounded-sm' />
            </div>

          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-medium">3</TableCell>
          <TableCell className="text-center" >Switch Off</TableCell>
          <TableCell className=" text-right">

          <div className='flex justify-end items-center gap-2 '>
              <FaEdit className='sm:w-7 sm:h-7 w-5 h-5 bg-[#FF9F00] text-white p-1 cursor-pointer rounded-sm' />
              <IoMdClose className='sm:w-7 sm:h-7 w-5 h-5 bg-[#FF5E5E] text-white p-1 cursor-pointer rounded-sm' />
            </div>

          </TableCell>
        </TableRow>


      </TableBody>
    </Table>
  </div>
  )
}

export default CallType