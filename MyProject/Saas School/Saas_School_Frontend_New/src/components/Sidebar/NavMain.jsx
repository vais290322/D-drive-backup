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
  // console.log(items);
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

    <SidebarGroup>
      <SidebarMenu>
        {items?.map((item) => {


          if (item?.render) {
            return (
              <div key="audit-custom-btn" className="mb-2 flex justify-center">
                <button
                  onClick={item.render.props.onClick}
                  className="w-11/12 flex items-center justify-center gap-2 px-5  rounded-xl bg-gradient-to-r from-[#c3a7db]  to-white text-gray-800 shadow-lg hover:text-white hover:from-gray-500 hover:to-gray-200 transition-all duration-200 border-none outline-none text-lg tracking-wide"
                  style={{
                    boxShadow: "0 4px 20px 0 rgba(156, 39, 176, 0.2), 0 1.5px 4px 0 rgba(233, 30, 99, 0.15)"
                  }}
                >
                  {/* <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path fill="#fff" d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg> */}
                  <span>Audit</span>
                </button>
              </div>
            );
          }


          const isActive = location.pathname === item?.url;

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive}
              className="group/collapsible font-poppins"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <NavLink to={item?.url}>
                    <SidebarMenuButton
                      tooltip={item?.title}
                      onClick={() => handleItemClick(item?.title)}
                      className={`flex items-center gap-[12px] ${isActive && "text-white" // Add the "active" class for styling
                        }`}
                    >
                      {item?.icon && (
                        <item.icon className="h-6 w-6" fontSize="medium" />
                      )}
                      <span className="text-[18px]">{item?.title}</span>
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
                              className={` ${isSubActive && "text-white" // Add the "active" class for styling
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
