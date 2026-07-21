import React from 'react'
import AppSidebar from "@/components/Dashboard/AppSidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { MdNotificationImportant, MdDarkMode, MdMail } from 'react-icons/md'

import { useBreadcrumb } from '@/context/BreadCrumbContext'
import { Outlet } from 'react-router-dom'
import MainDashboard from '@/pages/MainDashboard'
import Footer from '../Footer/Footer'
import w from "@/assets/w.svg"

import { IoIosNotifications } from "react-icons/io";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


const Dashboard = () => {

  const { breadcrumb } = useBreadcrumb();


  return (

    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className=" sticky top-0 z-10 flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-[#f3f3f3] border w-full">
          <div className="flex items-center gap-2 px-4 ">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumb.map((crumb, index) => (
                  <BreadcrumbItem key={index}>
                    {index === breadcrumb.length - 1 ? (
                      <BreadcrumbPage>{crumb}</BreadcrumbPage>
                    ) : (
                      <>
                        <BreadcrumbLink href="#">{crumb}</BreadcrumbLink>
                        <BreadcrumbSeparator />
                      </>
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>


          </div>

          {/* for header items in right side  */}

          <div className='flex gap-2 mr-6 cursor-pointer'>
            <IoIosNotifications className='w-7 h-7' />
            <MdDarkMode className='w-7 h-7' />
            <MdMail className='w-7 h-7' />

{/* for profile logo */}
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="bg-[#f3f3f3] hover:bg-white " ><img src={w} alt="profile" className='size-8' /></Button>
                </PopoverTrigger>
                <PopoverContent className="w-60">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                   {/*...................... for profile ................................... */}
                   <Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>Webbixel</AvatarFallback>
</Avatar>

                {/*.............................. Profile End ............................ */}


                      <h4 className="font-medium leading-none">Logout</h4>
                    </div>

                  </div>
                </PopoverContent>
              </Popover>
            </div>




          </div>
        </header>


        {/* Main content area */}
        <div className="flex flex-1 flex-col gap-4  pt-0 ">
          {/* <MainDashboard/> */}
          <div className='flex-1 p-4' >
            <Outlet />
          </div>


        </div>


        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>



  )
}

export default Dashboard