import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, X, Check, SquarePen } from "lucide-react";
import {
  CourseUrl,
  getAuthHeaders,
  PlanUrl,
  SessionUrl,
} from "../config/config";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";

const ManageCourseSetup = () => {
  const [plans, setPlans] = useState([]);
  const [editPlan, setEditPlan] = useState(null); // plan object
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);

  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [showAddPlan, setShowAddPlan] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddSession, setShowAddSession] = useState(false);

  const [newPlan, setNewPlan] = useState("");
  const [newCourse, setNewCourse] = useState({
    courseName: "",
    durationYears: 0,
    totalCourseFee: 0,
    planName: "",
  });
  const [newSession, setNewSession] = useState("");
  //edit session
  const [editSessionId, setEditSessionId] = useState(null);
  const [editSessionValue, setEditSessionValue] = useState("");
  // const [showEditModal, setShowEditModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [showEditSessionModal, setShowEditSessionModal] = useState(false);

  //edit course
  const [editCourseId, setEditCourseId] = useState(null);
  const [editCourse, setEditCourse] = useState({
    courseName: "",
    durationYears: 0,
    totalCourseFee: 0,
    planName: "",
  });

  const [selectedCourse, setSelectedCourse] = useState(null);
  // post plan
  const handleAddPlan = async () => {
    try {
      const res = await axios.post(
        PlanUrl.postPlan,
        { planName: newPlan },
        { headers: getAuthHeaders() }
      );
      setPlans((prev) => [
        ...prev,
        { plan: res.data.data, noOfCourse: 0, noOfStudents: 0 },
      ]);
      setNewPlan("");
      setShowAddPlan(false);
      toast.success("Plan added successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message || "Failed to add plan");
    }
  };
  //update plan
  const handleUpdatePlan = async () => {
    try {
      const planId = editPlan?.plan?.id;
      if (!planId) {
        toast.error("Invalid plan ID");
        return;
      }

      const res = await axios.put(
        `${PlanUrl.updatePlan}/${planId}`,
        { planName: editPlan.plan.planName }, // <-- Correct property
        { headers: getAuthHeaders() }
      );

      const updated = res.data.data;

      setPlans((prev) =>
        prev.map((p) => (p.plan.id === planId ? { ...p, plan: updated } : p))
      );

      setShowEditPlanModal(false);
      toast.success("Plan updated successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message || "Failed to update plan");
    }
  };

  //delete plan
  const handleDeletePlan = async (id) => {
    try {
      await axios.delete(`${PlanUrl.deletePlan}/${id}`, {
        headers: getAuthHeaders(),
      });
      setPlans((prev) => prev.filter((p) => p.plan.id !== id));
      toast.success("Plan deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message || "Failed to delete plan");
    }
  };

  // post course
  const handleAddCourse = async () => {
    try {
      const res = await axios.post(
        CourseUrl.postCourse,
        {
          courseName: newCourse.courseName,
          durationYears: Number(newCourse.durationYears),
          totalCourseFee: Number(newCourse.totalCourseFee),
          planName: newCourse.planName,
        },
        { headers: getAuthHeaders() }
      );
      setCourses((prev) => [
        ...prev,
        { course: res.data?.data, noOfStudents: 0 },
      ]);

      // const fetchInitialData = async () => {
      //   try {
      //     const [plansRes, coursesRes, sessionsRes] = await Promise.all([
      //       axios.get(PlanUrl.getPlans, { headers: getAuthHeaders() }),
      //       axios.get(CourseUrl.getCourses, { headers: getAuthHeaders() }),
      //       axios.get(SessionUrl.getSessions, { headers: getAuthHeaders() }),
      //     ]);
      //     setPlans(plansRes.data?.data);
      //     setCourses(coursesRes.data?.data);
      //     setSessions(sessionsRes.data?.data);
      //   } catch (err) {
      //     console.error("Failed to fetch initial data", err);
      //   }
      // };

      setShowAddCourse(false);
      setNewCourse({
        courseName: "",
        durationYears: 0,
        totalCourseFee: 0,
        planName: "",
      });

      toast.success("Course added successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message || "Failed to add course");
    }
  };

  //update course
  const handleUpdateCourse = async () => {
    try {
      const res = await axios.put(
        `${CourseUrl.updateCourse}/${editCourseId}`,
        {
          courseName: selectedCourse.courseName,
          durationYears: Number(selectedCourse.durationYears),
          totalCourseFee: Number(selectedCourse.totalCourseFee),
          planName: selectedCourse.planName,
        },
        { headers: getAuthHeaders() }
      );
      const updated = res.data.data;
      setCourses((prev) =>
        prev.map((c) => (c.id === editCourseId ? updated : c))
      );
      setEditCourseId(null);
      toast.success("Course updated");
      await fetchInitialData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update course");
    }
  };

  //delete course
  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`${CourseUrl.deleteCourse}/${id}`, {
        headers: getAuthHeaders(),
      });

      // Remove the course from local state
      setCourses((prev) => prev.filter((item) => item.course?.id !== id));

      toast.success("Course deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message || "Failed to delete course");
    }
  };

  //post session
  const handleAddSession = async () => {
    try {
      const res = await axios.post(
        SessionUrl.postSession,
        { session: newSession },
        { headers: getAuthHeaders() }
      );

      // Refresh data from server so sessions (and any dependent lists) update instantly
      await fetchInitialData();

      setNewSession("");
      setShowAddSession(false);
      toast.success("Session added successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message || "Failed to add session");
    }
  };
  const handleUpdateSession = async () => {
    try {
      const res = await axios.put(
        `${SessionUrl.updateSession}/${editSessionId}`,
        { session: editSessionValue },
        { headers: getAuthHeaders() }
      );
      const updatedSession = res.data.data;

      setSessions((prev) =>
        prev.map((s) => (s.id === editSessionId ? updatedSession : s))
      );
      setShowEditSessionModal(false); // <-- Correct function call
      toast.success("Session updated successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message || "Failed to update session");
    }
  };

  // Update session

  // const handleUpdateSession = async () => {
  //   try {
  //     const res = await axios.put(
  //       `${SessionUrl.updateSession}/${editSessionId}`,
  //       { session: editSessionValue },
  //       { headers: getAuthHeaders() }
  //     );
  //     const updatedSession = res.data.data;

  //     setSessions((prev) =>
  //       prev.map((s) => (s.id === editSessionId ? updatedSession : s))
  //     );
  //    showEditSessionModal(false);
  //    toast.success("Session updated successfully");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to update session");
  //   }
  // };

  //delete session
  const handleDeleteSession = async (id) => {
    try {
      await axios.delete(`${SessionUrl.deleteSession}/${id}`, {
        headers: getAuthHeaders(),
      });
      // Remove the deleted session from state
      setSessions((prev) => prev.filter((session) => session.id !== id));
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message || "Failed to delete session");
    }
  };

  const fetchInitialData = async () => {
    try {
      const [plansRes, coursesRes, sessionsRes] = await Promise.all([
        axios.get(PlanUrl?.getPlans, { headers: getAuthHeaders() }),
        axios.get(CourseUrl?.getCourses, { headers: getAuthHeaders() }),
        axios.get(SessionUrl?.getSessions, { headers: getAuthHeaders() }),
      ]);
      setPlans(plansRes.data?.data);
      setCourses(coursesRes.data?.data);
      setSessions(sessionsRes.data?.data);
    } catch (err) {
      console.error(err, "Failed to fetch initial data");
      toast.error(err.response?.data?.message || "Failed to fetch initial data");
    }
  };

  useEffect(() => {
    axios
      .get(`${PlanUrl.getPlans}`, { headers: getAuthHeaders() })
      .then((res) => setPlans(res.data?.data));
    axios
      .get(`${CourseUrl.getCourses}`, { headers: getAuthHeaders() })
      .then((res) => setCourses(res.data?.data));
    axios
      .get(`${SessionUrl.getSessions}`, { headers: getAuthHeaders() })
      .then((res) => setSessions(res.data?.data));
    // fetchInitialData();
  }, []);

  return (
    <div className="p-6 space-y-8 text-sm">
      {/* === Course Plan Section === */}
      <div className="bg-white rounded-md shadow-md p-5 ">
        <h2 className="text-lg font-semibold mb-3">Courses Plan</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-400 [&>*]:py-2 ">
              <th>Course Plan Name</th>
              <th>No. of Course</th>
              <th>Total Students</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id} className="border-b border-gray-400 [&>*]:py-2">
                <td>{plan?.plan?.planName}</td>
                <td>{plan?.noOfCourse}</td>
                <td>{plan?.noOfStudents}</td>
                <td className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      setEditPlan(plan);
                      setShowEditPlanModal(true);
                    }}
                  >
                    <SquarePen size={16} />
                  </button>

                  <button onClick={() => handleDeletePlan(plan.plan.id)}>
                    <MdDelete size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {showAddPlan && (
              <tr className="border-b">
                <td>
                  <input
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value)}
                    placeholder="Enter Plan Name"
                    className="w-full border-b outline-none px-2 py-1"
                  />
                </td>
                <td>0</td>
                <td>0</td>
                <td className="flex gap-2">
                  <X size={16} onClick={() => setShowAddPlan(false)} />
                  <Check size={16} onClick={handleAddPlan} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <button
          onClick={() => setShowAddPlan(true)}
          className="bg-red-700 hover:bg-red-800 text-white w-full mt-2 py-1 rounded"
        >
          +
        </button>
 {showEditPlanModal && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4 shadow-lg relative">

      {/* Top-right × close button */}
      <button
        onClick={() => setShowEditPlanModal(false)}
        className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-red-600 focus:outline-none"
      >
        &times;
      </button>

      <h2 className="text-lg font-semibold">Edit Plan</h2>

      <input
        className="w-full border-b outline-none px-2 py-1"
        placeholder="Plan Name"
        value={editPlan.plan.planName}
        onChange={(e) =>
          setEditPlan({
            ...editPlan,
            plan: { ...editPlan.plan, planName: e.target.value },
          })
        }
      />

      <div className="flex justify-end pt-2">
        <button
          onClick={handleUpdatePlan}
          className="px-4 py-1 bg-[#b91c1c] text-white rounded-md"
        >
          Update
        </button>
      </div>
    </div>
  </div>
)}

      </div>

      {/* === Courses Section === */}
      <div className="bg-white rounded-md shadow-md p-5">
        <h2 className="text-lg font-semibold mb-3">Courses</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b [&>*]:py-2">
              <th>Course Name</th>
              <th>Duration</th>
              <th>Amount</th>
              <th>Course Plan</th>
              <th>Total Students</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((item) => (
              <tr key={item.course?.id} className="border-b  [&>*]:py-2">
                <td>{item?.course?.courseName}</td>
                <td>{item?.course?.durationYears}yr</td>
                <td>{item?.course?.totalCourseFee}</td>
                <td>{item?.course?.planName || "N/A"}</td>
                <td>{item?.noOfStudents || 0}</td>
                <td className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      const c = item.course;
                      setSelectedCourse({
                        id: c.id,
                        courseName: c.courseName,
                        durationYears: c.durationYears,
                        totalCourseFee: c.totalCourseFee,
                        planName: c.planName,
                      });

                      setShowEditCourseModal(true);
                    }}
                  >
                    <SquarePen size={16} />
                  </button>

                  <button onClick={() => handleDeleteCourse(item.course?.id)}>
                    <MdDelete size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {showAddCourse && (
              <tr className="border-b">
                <td>
                  <input
                    className="w-full border-b outline-none px-2 py-1"
                    placeholder="Name"
                    value={newCourse.courseName}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, courseName: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    className="w-full border-b outline-none px-2 py-1"
                    placeholder="Years"
                    type="number"
                    value={newCourse.durationYears}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        durationYears: e.target.value,
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    className="w-full border-b outline-none px-2 py-1"
                    placeholder="Fee"
                    type="number"
                    value={newCourse.totalCourseFee}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        totalCourseFee: e.target.value,
                      })
                    }
                  />
                </td>
                <td>
                  <select
                    className="w-full outline-none py-1"
                    value={newCourse.planName}
                    onChange={(e) => {
                      setNewCourse({
                        ...newCourse,
                        planName: e.target.value,
                      });
                    }}
                  >
                    <option value="">Select Plan</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.plan.planName}>
                        {plan.plan.planName}
                      </option>
                    ))}
                  </select>
                </td>
                <td>0</td>
                <td className="flex gap-2">
                  <X size={16} onClick={() => setShowAddCourse(false)} />
                  <Check size={16} onClick={handleAddCourse} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <button
          onClick={() => setShowAddCourse(true)}
          className="bg-red-700 hover:bg-red-800 text-white w-full mt-2 py-1 rounded"
        >
          +
        </button>
       {showEditCourseModal && selectedCourse && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4 shadow-lg relative">
      
      {/* Top-right × close button */}
      <button
        onClick={() => setShowEditCourseModal(false)}
        className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-red-600 focus:outline-none"
      >
        &times;
      </button>

      <h2 className="text-lg font-semibold">Edit Course</h2>

      <input
        className="w-full border-b outline-none px-2 py-1"
        placeholder="Course Name"
        value={selectedCourse.courseName}
        onChange={(e) =>
          setSelectedCourse({
            ...selectedCourse,
            courseName: e.target.value,
          })
        }
      />

      <input
        className="w-full border-b outline-none px-2 py-1"
        placeholder="Years"
        type="number"
        value={selectedCourse.durationYears}
        onChange={(e) =>
          setSelectedCourse({
            ...selectedCourse,
            durationYears: e.target.value,
          })
        }
      />

      <input
        className="w-full border-b outline-none px-2 py-1"
        placeholder="Fee"
        type="number"
        value={selectedCourse.totalCourseFee}
        onChange={(e) =>
          setSelectedCourse({
            ...selectedCourse,
            totalCourseFee: e.target.value,
          })
        }
      />

      <select
        value={selectedCourse.planName}
        onChange={(e) => {
          setSelectedCourse({
            ...selectedCourse,
            planName: e.target.value,
          });
        }}
        className="w-full border-b outline-none px-2 py-1"
      >
        <option value="">Select Plan</option>
        {plans.map((plan) => (
          <option key={plan.id} value={plan.plan.planName}>
            {plan.plan.planName}
          </option>
        ))}
      </select>

      <div className="flex justify-end gap-4 pt-2">
        <button
          onClick={async () => {
            try {
              const res = await axios.put(
                `${CourseUrl.updateCourse}/${selectedCourse.id}`,
                {
                  courseName: selectedCourse.courseName,
                  durationYears: Number(selectedCourse.durationYears),
                  totalCourseFee: Number(selectedCourse.totalCourseFee),
                  planName: selectedCourse.planName,
                },
                { headers: getAuthHeaders() }
              );
              setShowEditCourseModal(false);
              toast.success("Course updated successfully");
              await fetchInitialData();
            } catch (err) {
              console.error(err);
              toast.error("Failed to update course");
            }
          }}
          className="px-4 py-1 bg-[#b91c1c] text-white rounded-md"
        >
          Update
        </button>
      </div>
    </div>
  </div>
)}

      </div>

      {/* === Sessions Section === */}
      <div className="bg-white rounded-md shadow-md p-5">
        <h2 className="text-lg font-semibold mb-3">Session</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b [&>*]:py-2">
              <th>Session</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id} className="border-b  [&>*]:py-2 ">
                <td>{session.session}</td>
                <td className="flex gap-2  justify-end">
                  <button
                    onClick={() => {
                      setEditSessionId(session.id);
                      setEditSessionValue(session.session);
                      setShowEditSessionModal(true);
                    }}
                  >
                   <SquarePen size={16} />
                  </button>

                  <button onClick={() => handleDeleteSession(session.id)}>
                    <MdDelete size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {showAddSession && (
              <tr className="border-b">
                <td>
                  <input
                    className="w-full border-b outline-none px-2 py-1"
                    placeholder="Session"
                    value={newSession}
                    onChange={(e) => setNewSession(e.target.value)}
                  />
                </td>
                <td className="flex gap-2 justify-end">
                  <X size={16} onClick={() => setShowAddSession(false)} />
                  <Check size={16} onClick={handleAddSession} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <button
          onClick={() => setShowAddSession(true)}
          className="bg-red-700 hover:bg-red-800 text-white w-full mt-2 py-1 rounded"
        >
          +
        </button>
{showEditSessionModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white p-4 rounded-md shadow-md w-80 relative">
      
      {/* Top-right × close button */}
      <button
        onClick={() => setShowEditSessionModal(false)}
        className="absolute top-2 right-3 text-2xl text-gray-500 hover:text-red-600 focus:outline-none"
      >
        &times;
      </button>

      <h3 className="font-semibold text-lg mb-2">Edit Session</h3>
      
      <input
        type="text"
        value={editSessionValue}
        onChange={(e) => setEditSessionValue(e.target.value)}
        className="w-full border px-2 py-1 rounded mb-3"
      />

      <div className="flex justify-end">
        <button
          onClick={handleUpdateSession}
          className="px-3 py-1 bg-[#b91c1c] text-white rounded"
        >
          Update
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default ManageCourseSetup;
