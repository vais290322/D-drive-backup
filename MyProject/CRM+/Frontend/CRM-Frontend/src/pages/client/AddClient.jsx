import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from 'lucide-react';

const AddClient = () => {

  const [lodaing, setLodaing] = useState(false);
  const [clientloading, setClientloading] = useState(false);
  const [input, setInput] = useState({

    companyName: "",
    phoneNo: "",
    industryType: "",
    address: "",
    vaisRemark: ""

  });

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    })
  }

  // console.log("input : ", input)

  const fetchClientInformation = async () => {
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

  const addNewClient = async (e) => {
    e.preventDefault();

    try {
      setClientloading(true);
      const response = await axios.post("url", { input }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log("response : ", response);

      if (response.success) {
        setInput({
          companyName: "",
          phoneNo: "",
          industryType: "",
          address: "",
          vaisRemark: ""
        })
      }

    } catch (error) {
      toast.error(error.response.data.message);
    }
    finally {
      setClientloading(false)
    }


  }


  return (
    <div className='mt-4 font-poppins border'>
      <h2 className='bg-white flex justify-between items-center p-6 border-b' >

        <div>
          <span  >Client Information</span>
        </div>

<div className='flex  gap-4'>


        {/* for upload client photo  */}

        <div className=' ' > 
          <input type="file" className='' />
          <Button className="text-white bg-[#452B90] hover:bg-[#352072] " >Upload</Button>
        </div>

        {/* for addClient  */}
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="text-white bg-[#452B90] hover:bg-[#352072] "> <span><FaPlus /></span> Add Client </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[30%]">
              <DialogHeader>
                <DialogTitle>Add Client Information </DialogTitle>
                <DialogDescription>
                  Add new client. Click save when you're done.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={addNewClient} >
                <div className="grid gap-4 py-4">

                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="companyName" className="text-left">
                      Company Name <sup className='text-red-600'>*</sup>
                    </Label>
                    <Input required id="companyName" name="companyName" className="col-span-3" value={input.companyName} onChange={changeEventHandler} />
                  </div>

                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="phoneNo" className="text-left">
                      Phone No <sup className='text-red-600'>*</sup>
                    </Label>
                    <Input id="phoneNo" name="phoneNo" className="col-span-3" value={input.phoneNo} onChange={changeEventHandler} />
                  </div>

                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="industryType" className="text-left">
                      Industry Type <sup className='text-red-600'>*</sup>
                    </Label>
                    <Input id="industryType" name="industryType" className="col-span-3  " type="text" value={input.industryType} onChange={changeEventHandler} />
                  </div>

                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="address" className="text-left">
                      Address <sup className='text-red-600'>*</sup>
                    </Label>
                    <Input id="address" name="address" className="col-span-3  " type="text" value={input.address} onChange={changeEventHandler} />
                  </div>

                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="vaisRemark" className="text-left">
                      Vais Remark <sup className='text-red-600'>*</sup>
                    </Label>
                    <Input id="vaisRemark" name="vaisRemark" className="col-span-3" value={input.vaisRemark} onChange={changeEventHandler} />

                  </div>


                </div>
                <DialogFooter>
                  {
                    clientloading ? (
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
        </div>

      </h2>

      <Table className="bg-red-700" >
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-[#312A2A] ">S.No</TableHead>
            <TableHead className="text-[#312A2A]" >Company Name</TableHead>
            <TableHead className="text-[#312A2A]" >Phone Number</TableHead>
            <TableHead className="text-[#312A2A]" >Industry Type</TableHead>
            <TableHead className="text-[#312A2A]" >Address</TableHead>
            <TableHead className="text-[#312A2A]" >Vais Remark</TableHead>
            <TableHead className="text-right text-[#312A2A]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

          <TableRow>
            <TableCell className="font-medium text-[#97978C] ">1</TableCell>
            <TableCell className="text-[#97978C]" >Mizam Car</TableCell>
            <TableCell className="text-[#97978C]" >82400372566</TableCell>
            <TableCell className="text-[#97978C]" >Car showroom</TableCell>
            <TableCell className="text-[#97978C]" >Saltlake, WB</TableCell>
            <TableCell className="text-[#97978C]" >Nothing</TableCell>

            <TableCell className=" text-right">

              <div className='flex justify-end items-center gap-2 '>
                <FaEdit className='w-7 h-7 bg-[#FF9F00] text-white p-1 cursor-pointer rounded-sm' />
                <IoMdClose className='w-7 h-7 bg-[#FF5E5E] text-white p-1 cursor-pointer rounded-sm' />
              </div>

            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-medium ">2</TableCell>
            <TableCell>Bike Zone</TableCell>
            <TableCell>07007584288</TableCell>
            <TableCell>Auto mobile</TableCell>
            <TableCell>Kolkata, West Bengal</TableCell>
            <TableCell>none</TableCell>
            <TableCell className=" text-right">

              <div className='flex justify-end items-center gap-2 '>
                <FaEdit className='w-7 h-7 bg-[#FF9F00] text-white p-1 cursor-pointer rounded-sm' />
                <IoMdClose className='w-7 h-7 bg-[#FF5E5E] text-white p-1 cursor-pointer rounded-sm' />
              </div>

            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">3</TableCell>
            <TableCell>Maa Tara Motor</TableCell>
            <TableCell>8645791236</TableCell>
            <TableCell>Second hand bike showroom</TableCell>
            <TableCell>Deganga,WB</TableCell>
            <TableCell>Empty</TableCell>
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

export default AddClient