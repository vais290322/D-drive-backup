import React from 'react'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { LucideOctagon } from "lucide-react"
import w from "@/assets/w.svg"


const TeamSwitcher = () => {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
      <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground ">
                {/* <LucideOctagon/> */}
                <img src={w} alt="logo" className='' />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-xl">ebbixel</span> 
              </div>
              
      </SidebarMenuButton>
      <div className="grid flex-1 text-left text-sm leading-tight ml-12">
                <span>CRM+ | V.1 </span>
              </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default TeamSwitcher