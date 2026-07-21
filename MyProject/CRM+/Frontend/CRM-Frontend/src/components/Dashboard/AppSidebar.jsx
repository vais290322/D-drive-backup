import React from 'react'
import {
    BookOpen,
    Bot,
    Frame,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
    LayoutDashboardIcon
    
  } from "lucide-react"
  import  NavMain  from "@/components/Dashboard/NavMain"
  import  TeamSwitcher  from "@/components/Dashboard/TeamSwitcher"
  import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
  } from "@/components/ui/sidebar"

  import { GoHomeFill } from "react-icons/go";
  import { FaUserGroup } from "react-icons/fa6";
  import { IoSettingsSharp } from "react-icons/io5";



const AppSidebar = ({ ...props }) => {

    const data = {
        navMain: [
          {
            title: "Dashboard",
            url: "/main/dashboard",
            icon: GoHomeFill,
          },
          {
            title: "Staff Info",
            url: "/main/staff",
            icon: FaUserGroup,
            items: [
              // {
              //   title: "Add Stuff",
              //   url: "/dashboard/staff/add",
              // },
              {
                title: "Manage Stuff",
                url: "/main/staff/manage",
              },
              {
                title: "Staff Role",
                url: "/main/staff/role",
              },
            ],
          },
          {
            title: "Client Info",
            url: "/main/client",
            icon: FaUserGroup,
            items: [
              {
                title: "Add Client",
                url: "/main/client/add",
              },
              {
                title: "Manage Client",
                url: "/main/client/manage",
              },
              {
                title: "Update Client",
                url: "/main/client/update",
              },
            ],
          },
          {
            title: "Setting",
            url: "#",
            icon: IoSettingsSharp,
            items: [
              {
                title: "Service Type",
                url: "/main/setting/service-type",
              },
              {
                title: "Call Type",
                url: "/main/setting/call-type",
              },
              {
                title: "Default Remark",
                url: "/main/setting/default-remark",
              },
              {
                title: "Company Information",
                url: "/main/setting/company-information",
              },
            ],
          },
        ],
      }


  return (
    <Sidebar collapsible="icon" {...props} variant="sidebar">
     <SidebarHeader className="text-white"> 
      <TeamSwitcher  /> 
    </SidebarHeader> 
    <SidebarContent>
      <NavMain items={data.navMain}  />
    </SidebarContent>
  </Sidebar>
  )
}

export default AppSidebar