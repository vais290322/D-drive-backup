import { CustomDialog } from "@/components";
import api from "@/V2/service";
import { Check, Eye, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BlogCard, BlogView } from ".";

  export function RequestBlog({ blogs, loading, error, fetchRequests }) {
    const [dialogMode, setDialogMode] = useState(null); // "view" | "reject"
    const [selected, setSelected] = useState(null);
    const [reason, setReason] = useState("");
  
    useEffect(() => {
      const timer = setTimeout(() => error && setError(null), 3000);
      return () => clearTimeout(timer);
    }, [error]);
  
    const handleApprove = async (id) => {
      try {
        await api.put(`/blogs/approved/${id}`);
        fetchRequests();
      } catch {
        setError("Failed to approve request.");
      } finally {
        setDialogMode(null);
        setSelected(null);
      }
    };
  
    const handleReject = async (id, reasonText = "") => {
      try {
        await api.put(`/blogs/reject/${id}`, { reason: reasonText });
        fetchRequests();
      } catch {
        setError("Failed to reject request.");
      } finally {
        setDialogMode(null);
        setSelected(null);
        setReason("");
      }
    };
  
    return (
      <>
        <div className="rounded-md h-[1px] w-[98%] bg-[#9225211a] my-4" />
        {error && <p className="text-center py-4 text-red-600">{error}</p>}
        <div className="w-full space-y-3 overflow-y-auto max-h-[300px] pr-2">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              data={blog}
              actions={[
                {
                  label: "View",
                  icon: Eye,
                  onClick: () => {
                    setSelected(blog);
                    setDialogMode("view");
                  },
                },
                {
                  label: "Reject",
                  icon: X,
                  onClick: () => {
                    setSelected(blog);
                    setDialogMode("reject");
                  },
                },
                {
                  label: "Approve",
                  icon: Check,
                  onClick: () => handleApprove(blog.id),
                },
              ]}
            />
          ))}
        {blogs.length === 0 && !loading && (
          <p className="text-center text-gray-600 py-6">No blog requests found.</p>
        )}
      </div>
      {/* View Dialog */}
      <CustomDialog
        open={dialogMode === "view"}
        onOpenChange={(o) => {
          setDialogMode(o ? "view" : null);
          if (!o) setSelected(null);
        }}
        title="Requested Blog"
      >
        <BlogView data={selected} />
      </CustomDialog>

      {/* Reject Dialog */}
      <CustomDialog
        open={dialogMode === "reject"}
        onOpenChange={(o) => {
          setDialogMode(o ? "reject" : null);
          if (!o) {
            setSelected(null);
            setReason("");
          }
        }}
        title="Reject Blog Request"
      >
        <div className="flex flex-col space-y-4">
          <p className="text-sm text-gray-500">Title</p>
          <p className="font-medium">{selected?.title}</p>

          <label className="text-sm text-gray-500">Reason (optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="border rounded-md p-2 text-sm"
            placeholder="Optional reason for rejection"
          />

          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
              onClick={() => {
                setDialogMode(null);
                setSelected(null);
                setReason("");
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700"
              onClick={() => handleReject(selected.id, reason)}
            >
              Reject
            </button>
          </div>
        </div>
      </CustomDialog>
    </>
  );
}