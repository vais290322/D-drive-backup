import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"
import { MdDashboardCustomize } from "react-icons/md";
import { TbReportSearch } from "react-icons/tb";
import { PiStudentFill } from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdSettingsSuggest } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";


import { TeamSwitcher } from "./TeamSwitcher"
// import { NavProjects } from "@/components/nav-projects"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavProjects } from "./NavProjects"
import { NavUser } from "./NavUser"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  projects: [
    {
      name: "Dahsboard",
      url: "/",
      icon: MdDashboardCustomize,
    },
    {
      name: "Student's Reports",
      url: "/reports",
      icon: TbReportSearch ,
    },
    {
      name: "Teacher's Reports",
      url: "/teacher-reports",
      icon: TbReportSearch ,
    },
    {
      name: "Students",
      url: "/students",
      icon: PiStudentFill,
    },
    {
      name: "Teachers",
      url: "/teachers",
      icon: FaChalkboardTeacher,
    },
    {
      name: "Setting",
      url: "/setting",
      icon: MdSettingsSuggest,
    },
    {
      name: "Change Password",
      url: "/change-password",
      icon: RiLockPasswordFill,
    },
   
  ],
}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent >
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter className="cursor-pointer" >
        <NavUser user={data.user} className="cursor-pointer" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
