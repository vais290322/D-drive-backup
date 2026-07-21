import React from 'react'

import { ChevronRight,  } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import { useBreadcrumb } from '@/context/BreadCrumbContext'
import { FaMinus } from "react-icons/fa";
import { NavLink } from 'react-router-dom'

const NavMain = ({
    items,
  }) => {

    const {updateBreadcrumb}= useBreadcrumb();

    const handleItemClick = (itemTitle, subItemTitle = null) => {
        if (subItemTitle) {
          updateBreadcrumb([itemTitle, subItemTitle]);
        } else {
          updateBreadcrumb([itemTitle]);
        }
      };
    


  return (
    <SidebarGroup>
    
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
              <NavLink to={item.url}>  
                <SidebarMenuButton tooltip={item.title} onClick={() => handleItemClick(item.title)} >
                 
                  {item?.icon && <item.icon className="text-white"/>}
                  <span  className='text-white' >{item.title}</span>
                  {
                    item?.items && 
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-white" />
                    }

                </SidebarMenuButton>
                </NavLink>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild >
                        <NavLink to={subItem.url} onClick={() => handleItemClick(item.title, subItem.title)}  >
                         <span className='text-white'><FaMinus/></span> <span className='text-white'>  {subItem.title}</span>
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default NavMain