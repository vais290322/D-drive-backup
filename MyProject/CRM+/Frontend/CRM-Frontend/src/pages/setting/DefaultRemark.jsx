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

const DefaultRemark = () => {

  const [lodaing, setLodaing] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const [service_type_name, setService_type_name] = useState("");

  const changeEventHandler = (e) => {
    setService_type_name(e.target.value);
  }

  console.log("Service type : ", service_type_name)

  const fetchServiceType = async () => {

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

  const addNewServiceType = async (e) => {
    e.preventDefault();

    try {
      setPostApiLoading(true);
      const response = await axios.post("url", { service_type_name }, {
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
      <h2 className='bg-white flex justify-between items-center p-3  sm:p-6 border-b ' >

        <div>
          <span  >Service Type</span>
        </div>

        {/* for addService type buton  */}
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="text-white  bg-[#452B90] hover:bg-[#352072] "> <span className='hidden sm:block'><FaPlus /></span> Add Service Type</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[30%] max-w-[80%]">
              <DialogHeader>
                <DialogTitle>Create Service Type</DialogTitle>
                <DialogDescription>
                  Add new service type. Click save when you're done.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={addNewServiceType} >
                <div className="grid gap-4 py-4">

                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="service_type_name" className="text-left">
                      Service Type Name <sup className='text-red-600 hidden sm:inline'>*</sup>
                    </Label>
                    <Input required id="service_type_name" name="service_type_name" className="col-span-3" value={service_type_name} onChange={changeEventHandler} />
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

      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-[#312A2A] ">S.No</TableHead>
            <TableHead className="text-center text-[#312A2A] ">Default Remark</TableHead>
            <TableHead className="text-right text-[#312A2A] ">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

          <TableRow>
            <TableCell className="font-medium text-[#97978C] ">1</TableCell>
            <TableCell className="text-center text-[#97978C] ">Need To Call Back </TableCell>

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

export default DefaultRemark