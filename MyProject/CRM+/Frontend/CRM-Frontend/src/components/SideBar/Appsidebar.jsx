import React from 'react'
import { Calendar, Home, Inbox, Search, Settings,  } from "lucide-react"
import { MdKeyboardArrowDown } from "react-icons/md";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarHeader
} from "@/components/ui/sidebar";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"




const items = [
    {
        title: "Dashboard",
        url: "#",
        icon: Home,
    },
    {
        title: "Staff Info",
        url: "#",
        icon: Inbox,
        subitem: [
            {
                sub_title: "Add Staff"
            },
            {
                sub_title: "Manage Staff"
            },
            {
                sub_title: "Staff Role"
            },
        ]
    },
    {
        title: "Client",
        url: "#",
        icon: Calendar,
        subitem: [
            {
                sub_title: "At Client"
            },
            {
                sub_title: "Manage Client"
            },
            {
                sub_title: "item3"
            },
        ]
    },
    {
        title: "Search",
        url: "#",
        icon: Search,
        subitem: [
            {
                sub_title: "item1"
            },
            {
                sub_title: "item2"
            },
            {
                sub_title: "item3"
            },
        ]
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
        subitem: [
            {
                sub_title: "item1"
            },
            {
                sub_title: "item2"
            },
            {
                sub_title: "item3"
            },
        ]
    },
]


const Appsidebar = () => {
    return (
        
       
        <Sidebar  >
            <SidebarHeader className="text-white font-poppins">Webbixel</SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
                    <SidebarGroupContent>
                        <SidebarMenu>

                            {items.map((item) => (
                                <Collapsible defaultOpen className="group/collapsible" key={item.title}>
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton className="font-poppins text-lg">
                                                <item.icon className='text-white hover:text-[#D39F4C]' />
                                                <div className=' w-40 flex justify-between'>   
                                                <span className='text-white hover:text-[#D39F4C]'>{item.title}</span>
                                                {
                                                    item.subitem && <span className='text-white hover:text-[#D39F4C]'> <MdKeyboardArrowDown />
                                                </span>
                                                }
                                                

                                                </div>

                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {
                                                    item?.subitem?.map((sublist) => (

                                                        <SidebarMenuSubItem className="text-white text-base hover:text-[#D39F4C] cursor-pointer"> -  {sublist.sub_title} </SidebarMenuSubItem>

                                                    ))
                                                }
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ))}

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
     
    )
}

export default Appsidebar