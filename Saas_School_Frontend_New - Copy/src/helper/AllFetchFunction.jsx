import { setClass } from "@/utils/academic/classSlice";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { academicUrlApi } from "@/common";
import { setSection } from "@/utils/academic/sectionSlice";
import { setSubject } from "@/utils/academic/subjectSlice";
import { setExamType } from "@/utils/routines/examTypeSlice";
import routineUrlApi from "@/common/routines";
import { setBloodGroups, setGenders, setReligions } from "@/utils/settings/settingsSlice";
import settingUrlApi from "@/common/setting";
import mainUrlApi from "@/common/main";
import { setInstitute } from "@/utils/Institute/instituteSlice";
import { setClassTime } from "@/utils/routines/classTimeSlice";
import { useEffect } from "react";
import { addEvent } from "@/utils/event/eventSlice";

export const useFetchAllClass = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state?.auth?.user);
  const schoolId = useSelector((state)=>state?.auth.schoolId);
  

  useEffect(() => {
    const fetchAllClass = async () => {
      try {
        const response = await axios.get(`${academicUrlApi.getAllClass.url}/${schoolId}`);
        dispatch(setClass(response?.data));
      } catch (error) {
        // toast.error(error.response?.data?.message || "Error fetching data");
      }
    };
    fetchAllClass();
  }, [role,schoolId]); // Re-fetch when `role` changes
};

export const useFetchAllSection = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state?.auth?.user);
  const schoolId = useSelector((state)=>state?.auth?.schoolId);

  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        const response = await axios.get(`${academicUrlApi.getAllSection.url}/${schoolId}`);
        dispatch(setSection(response?.data));
      } catch (error) {
        // toast.error(error.response?.data?.message || "Error fetching data");
      }
    };
    fetchSectionData();
  }, [role,schoolId]); // Re-fetch when `role` changes
};

export const useFetchAllSubject = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state?.auth?.user);
  const schoolId = useSelector((state)=>state?.auth?.schoolId);

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        const response = await axios.get(`${academicUrlApi.getAllSubject.url}/${schoolId}`);
        if (response) {
          dispatch(setSubject(response?.data));
        }
      } catch (error) {
        // toast.error(error.response?.data?.message || "Error fetching data");
      }
    };
    fetchSubjectData();
  }, [role,schoolId]); // Re-fetch when `role` changes
};

export const useFetchAllExamType = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state?.auth?.user);
  const schoolId = useSelector((state)=>state?.auth?.schoolId)

  useEffect(() => {
    const fetchExamTypeData = async () => {
      try {
        const response = await axios.get(`${routineUrlApi.getExamType.url}/${schoolId}`);
        dispatch(setExamType(response?.data?.data));
      } catch (error) {
        // toast.error(error.response?.data?.message || "Failed to fetch the data");
      }
    };
    fetchExamTypeData();
  }, [role,schoolId]); // Re-fetch when `role` changes
};

export const useFetchAllGender = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state?.auth?.user);
  const schoolId = useSelector((state)=>state?.auth?.schoolId);

  useEffect(() => {
    const fetchGenderData = async () => {
      try {
        const response = await axios.get(`${settingUrlApi.getAllGender.url}${schoolId}`);
        if (response) {
          dispatch(setGenders(response?.data?.data));
        }
      } catch (error) {
        // toast.error(error.response?.data?.message || "Error fetching data");
      }
    };
    fetchGenderData();
  }, [role,schoolId]); // Re-fetch when `role` changes
};

export const useFetchAllBloodGroup = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state?.auth?.user);
  const schoolId = useSelector((state)=>state?.auth.schoolId);

  useEffect(() => {
    const fetchBloodGroupData = async () => {
      try {
        const response = await axios.get(`${settingUrlApi.getAllBloodGroup.url}/${schoolId}`);
        if (response) {
          dispatch(setBloodGroups(response?.data?.data));
        }
      } catch (error) {
        // toast.error(error?.response?.data?.message || "Error fetching data");
      }
    };
    fetchBloodGroupData();
  }, [role,schoolId]); // Re-fetch when `role` changes
};

export const useFetchAllReligion = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state?.auth?.user);
  const schoolId = useSelector((state)=>state.auth.schoolId);

  useEffect(() => {
    const fetchReligionData = async () => {
      try {
        const response = await axios.get(`${settingUrlApi.getAllReligion.url}/${schoolId}`);
        if (response) {
          dispatch(setReligions(response?.data?.data));
        }
      } catch (error) {
        // toast.error(error.response?.data?.message || "Error fetching data");
      }
    };
    fetchReligionData();
  }, [role,schoolId]); // Re-fetch when `role` changes
};

export const useFetchSchoolInformation = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state?.auth?.user);
  const schoolId = useSelector((state)=>state?.auth?.schoolId);

  useEffect(() => {
    const fetchInstituteInformation = async () => {
      try {
        const response = await axios.get(
          `${mainUrlApi.instituteInfo.url}/sc/${schoolId}`
          //6788bb6b605207527119d8cd`
        );
        if (response) {
          dispatch(setInstitute(response?.data?.data));
        }
      } catch (error) {
        // console.error("Error fetching institute information:", error);
        // toast.error(error.response?.data?.message || "school not found please contact admin");
      }
    };
    fetchInstituteInformation();
  }, [role,schoolId]); // Re-fetch when `role` changes
};

export const useFetchAllClassTime = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user);
  const schoolId = useSelector((state)=>state?.auth?.schoolId);

  useEffect(() => {
    const fetchPeriodsData = async () => {
      try {
        const response = await axios.get(`${routineUrlApi.getClassTime.url}/${schoolId}`);
        if (response) {
          dispatch(setClassTime(response?.data?.data));
        }
      } catch (error) {
        // toast.error(error.response?.data?.message || "Error fetching data");
      }
    };
    fetchPeriodsData();
  }, [role,schoolId]); // Re-fetch when `role` changes
};


export const useFetchAllEvents = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user);
  const schoolId = useSelector((state)=>state?.auth?.schoolId)
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${routineUrlApi.addEvent.url}/${schoolId}`);
        // console.log("response : ", response); // Log the response data
        if (response) {
          dispatch(addEvent(response?.data?.data));
        }
      } catch (error) {
        // toast.error("Something went wrong to fetch events");  
      }
    }
    fetchEvent();
  }, [role,schoolId]); // Re-fetch when `role` changes
};

