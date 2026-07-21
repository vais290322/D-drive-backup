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


const StaffInformation = () => {

    const [lodaing, setLodaing] = useState(false);
    const [staffloading, setStaffloading] = useState(false);
    const [input, setInput] = useState({

        name: "",
        phoneNo: "",
        email: "",
        dob: "",
        type: ""

    });

    const changeEventHandler = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    // console.log("input : ", input)

    const fetchStuffInformation = async () => {

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

    const addNewStaff = async (e) => {
        e.preventDefault();

        try {
            setStaffloading(true);
            const response = await axios.post("url", { input }, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            console.log("response : ", response);

            if (response.success) {
                setInput({
                    name: "",
                    phoneNo: "",
                    email: "",
                    dob: "",
                    type: ""
                })
            }

        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally {
            setStaffloading(false)
        }


    }


    return (
        <div className='mt-4 font-poppins border'>
            <h2 className='bg-white flex justify-between items-center p-6 border-b' >

                <div>
                    <span  >Staff Information</span>
                </div>

                {/* for addStuff  */}
                <div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button  className="text-white bg-[#452B90] hover:bg-[#352072] "> <span><FaPlus /></span> Add Stuff</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[30%]">
                            <DialogHeader>
                                <DialogTitle>Create Staff</DialogTitle>
                                <DialogDescription>
                                    Add new stuff. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={addNewStaff} >
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 items-center gap-4">
                                        <Label htmlFor="name" className="text-left">
                                            Stuff Name <sup className='text-red-600'>*</sup>
                                        </Label>
                                        <Input required id="name" name="name" className="col-span-3" value={input.name} onChange={changeEventHandler} />
                                    </div>

                                    <div className="grid grid-cols-2 items-center gap-4">
                                        <Label htmlFor="phoneNo" className="text-left">
                                            Phone No <sup className='text-red-600'>*</sup>
                                        </Label>
                                        <Input id="phoneNo" name="phoneNo" className="col-span-3" value={input.phoneNo} onChange={changeEventHandler} />
                                    </div>

                                    <div className="grid grid-cols-2 items-center gap-4">
                                        <Label htmlFor="email" className="text-left">
                                            Email <sup className='text-red-600'>*</sup>
                                        </Label>
                                        <Input id="email" name="email" className="col-span-3  " type="email" value={input.email} onChange={changeEventHandler} />
                                    </div>

                                    <div className="grid grid-cols-2 items-center gap-4">
                                        <Label htmlFor="dob" className="text-left">
                                            Date Of Birth <sup className='text-red-600'>*</sup>
                                        </Label>
                                        <Input id="dob" name="dob" className="col-span-3  " type="date" value={input.dob} onChange={changeEventHandler} />
                                    </div>

                                    <div className="grid grid-cols-2 items-center gap-4">
                                        <Label htmlFor="type" className="text-left">
                                            Stuff Type <sup className='text-red-600'>*</sup>
                                        </Label>
                                        {/* <Input id="username"  className="col-span-3" /> */}
                                        <Select onValueChange={(value) => setInput({ ...input, type: value })}>
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select a type for stuff" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>type</SelectLabel>
                                                    <SelectItem value="apple">Apple</SelectItem>
                                                    <SelectItem value="banana">Banana</SelectItem>
                                                    <SelectItem value="blueberry">Blueberry</SelectItem>
                                                    <SelectItem value="grapes">Grapes</SelectItem>
                                                    <SelectItem value="pineapple">Pineapple</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
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
                        <TableHead className="text-[#312A2A]" >Staff Name</TableHead>
                        <TableHead className="text-[#312A2A]" >Phone Number</TableHead>
                        <TableHead className="text-[#312A2A]" >Email Address</TableHead>
                        <TableHead className="text-[#312A2A]" >Date Of Birth</TableHead>
                        <TableHead className="text-[#312A2A]" >Staff Type</TableHead>
                        <TableHead className="text-right text-[#312A2A]">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>

                    <TableRow>
                        <TableCell className="font-medium text-[#97978C] ">7</TableCell>
                        <TableCell className="text-[#97978C]" >Ayan Dey</TableCell>
                        <TableCell className="text-[#97978C]" >8240037238</TableCell>
                        <TableCell className="text-[#97978C]" >ayan.day@vais.co.in</TableCell>
                        <TableCell className="text-[#97978C]" >1997-10-19</TableCell>
                        <TableCell className="text-[#97978C]" >Admin</TableCell>

                        <TableCell className=" text-right">

                            <div className='flex justify-end items-center gap-2 '>
                                <FaEdit className='w-7 h-7 bg-[#FF9F00] text-white p-1 cursor-pointer rounded-sm' />
                                <IoMdClose className='w-7 h-7 bg-[#FF5E5E] text-white p-1 cursor-pointer rounded-sm' />
                            </div>

                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="font-medium ">8</TableCell>
                        <TableCell>SK Khairul Haque</TableCell>
                        <TableCell>4578963125</TableCell>
                        <TableCell>khairul.h@webbixel.com</TableCell>
                        <TableCell>2002-11-10</TableCell>
                        <TableCell>Admin</TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="font-medium">11</TableCell>
                        <TableCell>Sourav Das</TableCell>
                        <TableCell>8645791236</TableCell>
                        <TableCell>sourav@vais.co.in</TableCell>
                        <TableCell>1994-02-13</TableCell>
                        <TableCell>In House Staff</TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>


                </TableBody>
            </Table>
        </div>

    )
}

export default StaffInformation