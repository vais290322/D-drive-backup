import React from "react";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { FaWindowMinimize } from "react-icons/fa6";
import { useBreadcrumb } from "@/context/BreadCrumbContext";
import { NavLink, useLocation } from "react-router-dom";
const NavMain = ({ items }) => {
  const { updateBreadcrumb } = useBreadcrumb();

  const location = useLocation();

  const handleItemClick = (itemTitle, subItemTitle = null) => {
    if (subItemTitle) {
      updateBreadcrumb([itemTitle, subItemTitle]);
    } else {
      updateBreadcrumb([itemTitle]);
    }
  };

  return (
    // <SidebarGroup>
    //   <SidebarMenu>
    //     {items.map((item) => (
    //       <Collapsible
    //         key={item.title}
    //         asChild
    //         defaultOpen={item.isActive}
    //         className="group/collapsible"
    //       >
    //         <SidebarMenuItem>
    //           <CollapsibleTrigger asChild>
    //             <SidebarMenuButton tooltip={item.title} onClick={() => handleItemClick(item.title)}  >
    //               <div className="flex items-center gap-[12px]">
    //                 {item.icon && <item.icon className=" h-6 w-6  " fontSize="medium" />}
    //                 <span className='text-[18px]' >{item.title}</span>
    //               </div>
    //               {
    //                 item?.items &&
    //                 <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
    //               }

    //             </SidebarMenuButton>
    //           </CollapsibleTrigger>
    //           <CollapsibleContent>
    //             <SidebarMenuSub>
    //               {item.items?.map((subItem) => (
    //                 <SidebarMenuSubItem key={subItem.title}>
    //                   <SidebarMenuSubButton asChild>
    //                     <NavLink to={subItem.url} onClick={() => handleItemClick(item.title, subItem.title)}  >
    //                       <span className='mb-1.5'><FaWindowMinimize /></span>
    //                       <span className='text-[16px]' >{subItem.title}</span>
    //                     </NavLink>
    //                   </SidebarMenuSubButton>
    //                 </SidebarMenuSubItem>
    //               ))}
    //             </SidebarMenuSub>
    //           </CollapsibleContent>
    //         </SidebarMenuItem>
    //       </Collapsible>
    //     ))}
    //   </SidebarMenu>
    // </SidebarGroup>
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = location.pathname === item.url;

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive}
              className="group/collapsible font-poppins"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <NavLink to={item.url}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={() => handleItemClick(item.title)}
                      className={`flex items-center gap-[12px] ${
                        isActive && "text-white" // Add the "active" class for styling
                      }`}
                    >
                      {item.icon && (
                        <item.icon className="h-6 w-6" fontSize="medium" />
                      )}
                      <span className="text-[18px]">{item.title}</span>
                      {item?.items && (
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </SidebarMenuButton>
                  </NavLink>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isSubActive = location.pathname === subItem.url;

                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink
                              to={subItem.url}
                              onClick={() =>
                                handleItemClick(item.title, subItem.title)
                              }
                              className={`flex items-center gap-[12px] hover:scale-110  ${
                                isSubActive && "text-white"
                              }`}
                            >
                              <span className="mb-1.5">
                                <FaWindowMinimize />
                              </span>
                              <span className="text-[16px]">
                                {subItem.title}
                              </span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavMain;
