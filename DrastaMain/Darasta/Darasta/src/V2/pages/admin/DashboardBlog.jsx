import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { BlogCreateForm } from "@/V2/components/admin/blog/BlogCreateForm";
import { CurrentBlog } from "@/V2/components/admin/blog/CurrentBlog";
import { RequestBlog } from "@/V2/components/admin/blog/RequestBlog";
import { CustomDialog } from "@/components";
import { useToast } from "@/context/ToastContext";
import api from "@/V2/service";

const sectionVariants = {
  collapsed: { height: 0, opacity: 0, transition: { duration: 0.3 } },
  expanded: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
};

export function DashboardBlog() {
  const { showToast } = useToast();
  const [viewSections, setViewSections] = useState({
    request: false,
    current: true,
    create: false,
  });

  const [currentBlogs, setCurrentBlogs] = useState([]);
  const [requestBlogs, setRequestBlogs] = useState([]);
  const [loadingCurrent, setLoadingCurrent] = useState(true);
  const [loadingRequest, setLoadingRequest] = useState(true);
  const [errorCurrent, setErrorCurrent] = useState(null);
  const [errorRequest, setErrorRequest] = useState(null);

  const fetchCurrentBlogs = async () => {
    setLoadingCurrent(true);
    setErrorCurrent(null);
    try {
      const { data: { data } } = await api.get("/blogs?publish=true");
      setCurrentBlogs(data.content);
    } catch {
      setErrorCurrent("Failed to fetch blogs.");
    } finally {
      setLoadingCurrent(false);
    }
  };

  const fetchRequestBlogs = async () => {
    setLoadingRequest(true);
    setErrorRequest(null);
    try {
      const { data: { data } } = await api.get("/blogs?publish=false");
      setRequestBlogs(data.content);
    } catch {
      setErrorRequest("Failed to fetch requests.");
    } finally {
      setLoadingRequest(false);
    }
  };

  useEffect(() => {
    fetchCurrentBlogs();
    fetchRequestBlogs();
  }, []);

  const toggle = (key) => {
    setViewSections((v) => {
      const other = key === "request" ? "current" : key === "current" ? "request" : null;
      const newVal = !v[key];
      const next = { ...v, [key]: newVal };
      if ((key === "request" || key === "current") && !newVal && other && !v[other]) {
        next[other] = true;
      }
      return next;
    });
  };

  const refetchAll = () => {
    fetchCurrentBlogs();
    fetchRequestBlogs();
  };

  const handleCreateSubmit = async (formData) => {
    try {
      await api.post("/blogs/upload", formData);
      showToast("Blog created successfully", "success");
      toggle("create");
      fetchCurrentBlogs();
    } catch {
      showToast("Failed to create blog", "error");
    }
  };

  return (
    <div className="px-8 space-y-8 mb-8">
      {/* Create Blog + Refresh */}
      <div className="flex w-full justify-end items-center gap-2">
        <button
          onClick={refetchAll}
          className="p-2 rounded-full hover:bg-gray-200"
          title="Refresh All"
        >
          <RefreshCw />
        </button>
        <CustomDialog
          title="Create Blog"
          open={viewSections.create}
          onOpenChange={() => toggle("create")}
          trigger={<button className="bg-[#922521] text-white px-4 py-2 rounded-md">Create Blog</button>}
        >
          <BlogCreateForm onSubmit={handleCreateSubmit} />
        </CustomDialog>
      </div>

      <Section title="Blog Requests" isOpen={viewSections.request} onToggle={() => toggle("request")}>  
        <RequestBlog
          blogs={requestBlogs}
          loading={loadingRequest}
          error={errorRequest}
          setError={setErrorRequest}
          fetchRequests={fetchRequestBlogs}
        />
      </Section>

      <Section title="Current Blogs" isOpen={viewSections.current} onToggle={() => toggle("current")}>  
        <CurrentBlog
          blogs={currentBlogs}
          loading={loadingCurrent}
          error={errorCurrent}
          setError={setErrorCurrent}
          fetchPublished={fetchCurrentBlogs}
        />
      </Section>
    </div>
  );
}

const Section = ({ title, isOpen, onToggle, children }) => (
  <div className="border border-[#9225211a] rounded-md overflow-hidden">
    <button onClick={onToggle} className="w-full px-4 py-2 flex items-center justify-between bg-[#F9EBE9]">
      <h2 className="text-2xl font-bold">{title}</h2>
      {isOpen ? <ChevronUp /> : <ChevronDown />}
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div key={title} variants={sectionVariants} initial="collapsed" animate="expanded" exit="collapsed" className="px-4 py-6">
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);