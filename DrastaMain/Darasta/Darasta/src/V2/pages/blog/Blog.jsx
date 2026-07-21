import { BackButton } from "@/V2/components";
import { CreateBlogBtn, SidebarBlogs } from "@/V2/components/blog";
import { Outlet, useLocation } from "react-router-dom";

export function Blog() {
  const { pathname } = useLocation();

  return (
    <section className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-[200px] bg-gray-50 min-h-screen pb-[100px]">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-8 sm:py-12">
        <div className="flex items-center gap-3">
          <BackButton />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Blogs</h1>
        </div>

        {pathname !== "/blog/create" && (
          <CreateBlogBtn />
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Outlet */}
        <div className="flex-1">
          <Outlet />
        </div>

        {/* Sidebar */}
        <div className="w-full lg:max-w-xs">
          <SidebarBlogs />
        </div>
      </div>
    </section>
  );
}
