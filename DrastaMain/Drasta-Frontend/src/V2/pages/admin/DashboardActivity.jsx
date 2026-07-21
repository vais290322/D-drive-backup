import { CustomDialog } from "@/components";
import { useToast } from "@/context/ToastContext";
import { Pagination } from "@/V2/components";
import {
  ActivityForm,
  AddCategoryForm,
  CategoryManagerModal,
  EventTable,
  SearchHeader,
} from "@/V2/components/admin/activity";
import api from "@/V2/service";
import { useEffect, useState } from "react";

export function DashboardActivity() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState({
    fetch: false,
    delete: false,
    create: false,
    edit: false,
  });
  const [dialog, setDialog] = useState({ mode: null, payload: null });
  const [pageInfo, setPageInfo] = useState({
    currentPage: 0,
    totalPages: 1,
    pageSize: 10,
    totalElements: 0,
  });
  const { showToast } = useToast();

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/initiatives/categories");
      setCategories(data.data);
    } catch {
      showToast("Failed to load categories", "error");
    }
  };

  const fetchEvents = async (
    {
      searchTerm = "",
      searchDate = "",
      filterStartDate = "",
      filterEndDate = "",
    } = {},
    page = 0
  ) => {
    setLoading((l) => ({ ...l, fetch: true }));

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageInfo.pageSize.toString(),
      });

      if (searchTerm) queryParams.append("searchTerm", searchTerm);
      if (searchDate) queryParams.append("date", searchDate);
      if (filterStartDate) queryParams.append("startDate", filterStartDate);
      if (filterEndDate) queryParams.append("endDate", filterEndDate);

      const {
        data: { data },
      } = await api.get(`/events/search?${queryParams.toString()}`);
      setEvents(data.content);
      setPageInfo((p) => ({
        ...p,
        currentPage: data.number,
        totalPages: data.totalPages,
        pageSize: data.size,
        totalElements: data.totalElements,
      }));
    } catch {
      showToast("Failed to load events", "error");
    } finally {
      setLoading((l) => ({ ...l, fetch: false }));
    }
  };

  const handleDeleteEvent = async (id) => {
    setLoading((l) => ({ ...l, delete: true }));
    try {
      await api.delete(`/events/${id}`);
      showToast("Event deleted", "success");
      fetchEvents({}, pageInfo.currentPage);
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setLoading((l) => ({ ...l, delete: false }));
    }
  };

  const handleDialogSubmit = async (formData) => {
    const { mode, payload } = dialog;
    try {
      if (mode === "create") {
        setLoading((l) => ({ ...l, create: true }));
        await api.post("/events", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("Event created", "success");
      } else if (mode === "edit" && payload) {
        setLoading((l) => ({ ...l, edit: true }));
        await api.put(`/events/${payload.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("Event updated", "success");
      }
      setDialog({ mode: null, payload: null });
      fetchEvents({}, pageInfo.currentPage);
    } catch {
      showToast("Submit failed", "error");
    } finally {
      setLoading((l) => ({ ...l, create: false, edit: false }));
    }
  };

  const handleCategoryAdded = (category) => {
    setCategories((prev) => [...prev, category]);
    setDialog({ mode: null, payload: null });
  };

  useEffect(() => {
    fetchCategories();
    fetchEvents({}, pageInfo.currentPage);
  }, []);

  useEffect(() => {
    fetchEvents({}, pageInfo.currentPage);
  }, [pageInfo.currentPage]);

  const isView = dialog.mode === "view";
  const isEdit = dialog.mode === "edit";
  const isCreate = dialog.mode === "create";
  const isAddCategory = dialog.mode === "addCategory";
  const isModalOpen = isView || isEdit || isCreate || isAddCategory;
  const modalTitle = isCreate
    ? "Create Event"
    : isEdit
    ? "Edit Event"
    : isAddCategory
    ? "Add Category"
    : "Event Details";

  return (
    <div className="p-6">
      <SearchHeader
        onSearchParamsChange={fetchEvents}
        onSortClick={() => console.log("Sort clicked")}
        onOpenCalendar={() => console.log("Open calendar")}
        onNewEvent={() => setDialog({ mode: "create", payload: {} })}
        onManageCategories={() => setDialog({ mode: "manageCategories", payload: null })}
      />

      <EventTable
        events={events}
        categories={categories}
        loading={loading.fetch}
        onView={(evt) => setDialog({ mode: "view", payload: evt })}
        onEdit={(evt) => setDialog({ mode: "edit", payload: evt })}
        onDelete={handleDeleteEvent}
      />

      <Pagination
        currentPage={pageInfo.currentPage}
        totalPages={pageInfo.totalPages}
        onPageChange={(newPage) =>
          setPageInfo((p) => ({ ...p, currentPage: newPage }))
        }
      />

      <CategoryManagerModal
        open={dialog.mode === "manageCategories"}
        onClose={() => setDialog({ mode: null, payload: null })}
        categories={categories}
        refresh={fetchCategories}
         onAddCategoryClick={() => setDialog({ mode: "addCategory", payload: null })}
      />

      <CustomDialog
        open={isModalOpen}
        onOpenChange={(open) => !open && setDialog({ mode: null, payload: null })}
        title={modalTitle}
      >
        {isView ? (
          <div className="space-y-4">
            <img
              src={dialog.payload?.eventBannerUrl}
              alt="Banner"
              className="w-full h-48 object-cover rounded"
            />
            <p>
              <strong>Title:</strong> {dialog.payload?.eventTitle}
            </p>
            <p>
              <strong>Date:</strong> {dialog.payload?.eventDate}
            </p>
            <p>
              <strong>Location:</strong> {dialog.payload?.location}
            </p>
            <p>
              <strong>Description:</strong> {dialog.payload?.description}
            </p>
            <p>
              <strong>Category:</strong>{" "}
              {categories.find((c) => c.id === dialog.payload?.categoryId)?.title || "—"}
            </p>
          </div>
        ) : isAddCategory ? (
          <AddCategoryForm onCategoryAdded={handleCategoryAdded} />
        ) : (
          <ActivityForm
            initialData={dialog.payload || {}}
            categories={categories}
            onSubmit={handleDialogSubmit}
            loading={loading.create || loading.edit}
            onAddCategoryClick={() => setDialog({ mode: "addCategory", payload: null })}
          />
        )}
      </CustomDialog>
    </div>
  );
}