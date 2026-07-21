import React from 'react'
import {
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import w from "@/assets/w.png"
import { useSidebar } from '@/components/ui/sidebar'
import schoolLogo from "@/assets/schoolLogo.png"
import schoolLogoWhite1 from "@/assets/schoolLogoWhite1.png"

import vaisWhite from "@/assets/vaisWhite.png"
import vaisBlack from "@/assets/vaisBlack.png"
import vaisFav1 from "@/assets/vaisFav1.jpg"
import vaisFav from "@/assets/vaisFav.png"
import logo3 from "@/assets/logo3.png"
import { useTheme } from "@/context/ThemeContext";
const TeamSwitcher = () => {
const {state} = useSidebar()
// console.log("state : " ,state)
const { theme } = useTheme();
const version= import.meta.env.VITE_REACT_VERSION

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                {/* for logo  */}
                <div className={`flex justify-center items-center border-b-[1px] border-[#9850b2] border-opacity-1 pb-8 pt-2 ${state === 'collapsed' ? 'border-none pb-0' : 'block'} `}>
                    {
                        state === 'collapsed' ? (
                            <img src={w} alt="logo" className="w-30 h-10" />
                            // <img src={vaisFav} alt="logo" className="w-30 h-10" />
                        ) : (
                            theme === 'light' ? (
                                <img src={schoolLogoWhite1} alt="logo" className="w-30 h-10" />
                                // <img src={vaisWhite} alt="logo" className="w-30 h-10" />
                            ) : (
                            <img src={schoolLogo} alt="logo" className="w-30 h-10" />
                            // <img src={logo3} alt="logo" className="w-32 h-24" />
                            // <img src={vaisBlack} alt="logo" className="w-32 h-24" /> 
                            )
                        )
                    }  
                </div>
                {/* for version  */}
                <div className=" flex  text-md leading-tight ml-10 justify-between mt-4">
                    <span className={`${state === 'collapsed' ? 'hidden' : 'block '} ${theme=== 'light' ? 'text-[#b39e29]' : "text-[#6b289e]"} `}>School</span> <span className={`${state === 'collapsed' ? 'hidden' : 'block'} ${theme=== 'light' ? 'text-[#b39e29]' : "text-[#6b289e]"}  `}>V-{version}</span>
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export default TeamSwitcher