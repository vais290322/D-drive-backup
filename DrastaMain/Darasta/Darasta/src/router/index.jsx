import { Landing, NotFound } from "@/pages";
import {
  AbstractsandOngoing,
  AdministrationandOperations,
  Advisors,
  CareerSection,
  CSR,
  Database,
  DirectorsDesk,
  DrastaAvalokan,
  FocusGroupForm,
  GovernanceAndAdvisoryTrustees,
  GreenLeablepresent,
  LegalCompliance,
  News,
  OurCoordinates,
  Reports,
  Researchers,
  ResearchProjects,
  ResearchThemes,
  TrainingThemes,
  TrainingWorkshops,
  Gallery as V1Gallery,
  Home as V1Home,
  YoungResearcher,
} from "@/V1/pages";
import Collaborators from "@/V1/pages/Collaborators";
import { ScrollToTop } from "@/V2/components/ScrollToTop";
import { USER_ROLES } from "@/V2/config";
import {
  Gallery,
  Home,
  MainLayout,
  ProtectedRoute,
  Volunteer,
  Volunteer_log,
} from "@/V2/pages";
import { Activity, ActivityById, ActivityEvent } from "@/V2/pages/activity";
import {
  AdminLayout,
  Dashboard,
  DashboardActivity,
  DashboardBlog,
  DashboardDonation,
  DashboardGallery,
  DashboardVolunteer,
  DashboardNotices,
} from "@/V2/pages/admin";
import { Login, ResetPassword, SendOtp, Signup } from "@/V2/pages/auth";
import {
  Blog,
  CreateBlog,
  DisplayBlogs,
  EditBlog,
  SingleBlog,
} from "@/V2/pages/blog";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

export default function AppRouter() {
  return (
    <BrowserRouter>
      {/* this ensures every navigation scrolls to the top */}
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Landing />} />

        {/* V2 Routes */}
        <Route element={<MainLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="blog" element={<Blog />}>
            <Route index element={<DisplayBlogs />} />
            <Route path=":id" element={<SingleBlog />} />
            <Route
              path="create"
              element={
                <ProtectedRoute>
                  <CreateBlog />
                </ProtectedRoute>
              }
            />
            <Route
              path="edit/:id"
              element={
                <ProtectedRoute>
                  <EditBlog />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="activity" element={<Activity />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="volunteer" element={<Volunteer />} />
          <Route path="volunteer_log" element={<ProtectedRoute allowedRoles={[USER_ROLES.VOLUNTEER]}><Volunteer_log /></ProtectedRoute>} />
          <Route path="/activity/:categoryId" element={<ActivityById />} />
          <Route path="/event/:eventId" element={<ActivityEvent />} />
        </Route>

        {/* V2 Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/reset-password" element={<SendOtp />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* V2 dashboard  */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="gallery" element={<DashboardGallery />} />
          <Route path="activity" element={<DashboardActivity />} />
          <Route path="blog" element={<DashboardBlog />} />
          <Route path="volunteer" element={<DashboardVolunteer />} />
          <Route path="donation" element={<DashboardDonation />} />
          <Route path="notices" element={<DashboardNotices />} />
        </Route>

        {/* V1 Routes (Under a subpath) */}
        <Route path="/v1">
          <Route index element={<Navigate to="/v1/home" />} />
          <Route path="home" element={<V1Home />} />
          <Route path="our-coordinates" element={<OurCoordinates />} />
          <Route path="legal-compliance" element={<LegalCompliance />} />
          <Route path="gallery" element={<V1Gallery />} />
          <Route path="directors-desk" element={<DirectorsDesk />} />
          <Route path="reports" element={<Reports />} />
          <Route path="database" element={<Database />} />
          <Route path="news" element={<News />} />
          <Route path="csr" element={<CSR />} />
          <Route path="abstractsandongoing" element={<AbstractsandOngoing />} />
          <Route path="drastaavalokan" element={<DrastaAvalokan />} />
          <Route path="youngresearcher" element={<YoungResearcher />} />
          <Route path="training-workshops" element={<TrainingWorkshops />} />
          <Route path="training-themes" element={<TrainingThemes />} />
          <Route path="research-projects" element={<ResearchProjects />} />
          <Route path="research-themes" element={<ResearchThemes />} />
          <Route
            path="governanceandadvisorytrustees"
            element={<GovernanceAndAdvisoryTrustees />}
          />
          <Route path="advisors" element={<Advisors />} />
          <Route path="collaborators" element={<Collaborators />} />
          <Route path="researchers" element={<Researchers />} />
          <Route
            path="administrationandoperations"
            element={<AdministrationandOperations />}
          />
          <Route path="womenscience" element={<FocusGroupForm/>} />
          <Route path="greenleable" element={<GreenLeablepresent/>} />
          <Route path="career" element={<CareerSection/>} />

          {/* Add more V1 routes here */}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
