// import { setClass } from "@/utils/academic/classSlice";
// import axios from "axios";
// import { toast } from "sonner";
// import { useDispatch, useSelector } from "react-redux";
// import { academicUrlApi } from "@/common";
// import { setSection } from "@/utils/academic/sectionSlice";
// import { setSubject } from "@/utils/academic/subjectSlice";
// import { setExamType } from "@/utils/routines/examTypeSlice";
// import routineUrlApi from "@/common/routines";
// import {
//   setBloodGroups,
//   setGenders,
//   setReligions,
// } from "@/utils/settings/settingsSlice";
// import settingUrlApi from "@/common/setting";
// import mainUrlApi from "@/common/main";
// import { setInstitute } from "@/utils/Institute/instituteSlice";
// import { setClassTime } from "@/utils/routines/classTimeSlice";
// import { useEffect } from "react";

// export const useFetchAllClass = () => {
//   const dispatch = useDispatch();
//   const role = useSelector((state) => state.auth.user);

//   useEffect(() => {
//     const fetchAllClass = async () => {
//         try {
//           const response = await axios.get(`${academicUrlApi.getAllClass.url}`);
//           dispatch(setClass(response.data));
//         } catch (error) {
//           toast.error(error.response?.data?.message || "Error fetching data");
//         }
//       };
//       fetchAllClass();
//   }, [role]);
// };

// export const useFetchAllSection = () => {
//   const dispatch = useDispatch();

//   const fetchSectionData = async () => {
//     try {
//       const response = await axios.get(`${academicUrlApi.getAllSection.url}`);
//       dispatch(setSection(response.data));
//     } catch (error) {
//       toast.error(error.response.data.message);
//     }
//   };

//   return fetchSectionData;
// };

// export const useFetchAllSubject = () => {
//   const dispatch = useDispatch();

//   const fetchSubjectData = async () => {
//     try {
//       const response = await axios.get(`${academicUrlApi.getAllSubject.url}`);
//       if (response) {
//         dispatch(setSubject(response.data));
//       }
//     } catch (error) {
//       toast.error(error.response.data.message || "Error fetching data");
//     }
//   };

//   return fetchSubjectData;
// };

// export const useFetchAllExamType = () => {
//   const dispatch = useDispatch();

//   const fetchExamTypeData = async () => {
//     try {
//       const response = await axios.get(`${routineUrlApi.getExamType.url}`);
//       // console.log("response : ", response)
//       dispatch(setExamType(response.data.data));
//     } catch (error) {
//       toast.error(error.response.data.message || "Failed to fetch the data");
//     }
//   };

//   return fetchExamTypeData;
// };

// export const useFetchAllGender = () => {
//   const dispatch = useDispatch();

//   const fetchGenderData = async () => {
//     try {
//       const response = await axios.get(`${settingUrlApi.getAllGender.url}`);

//       // console.log("response : ", response);
//       if (response) {
//         dispatch(setGenders(response?.data?.data));
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Error fetching data");
//     }
//   };

//   return fetchGenderData;
// };

// export const useFetchAllBloodGroup = () => {
//   const dispatch = useDispatch();

//   const fetchBloodGroupData = async () => {
//     try {
//       const response = await axios.get(`${settingUrlApi.getAllBloodGroup.url}`);
//       if (response) {
//         dispatch(setBloodGroups(response.data.data));
//       }
//     } catch (error) {
//       toast.error(error?.response?.data?.message);
//     }
//   };

//   return fetchBloodGroupData;
// };

// export const useFetchAllReligion = () => {
//   const dispatch = useDispatch();

//   const fetchReligionData = async () => {
//     try {
//       const response = await axios.get(`${settingUrlApi.getAllReligion.url}`);
//       if (response) {
//         dispatch(setReligions(response?.data?.data));
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Error fetching data");
//     }
//   };

//   return fetchReligionData;
// };

// export const useFetchSchoolInformation = () => {
//   const dispatch = useDispatch();

//   const fetchInstituteInformation = async () => {
//     try {
//       const response = await axios.get(
//         `${mainUrlApi.instituteInfo.url}/6788bb6b605207527119d8cd`
//       );

//       if (response) {
//         dispatch(setInstitute(response?.data?.data));
//       }
//     } catch (error) {
//       console.error("Error fetching institute information:", error);
//     }
//   };

//   return fetchInstituteInformation;
// };

// export const useFetchAllClassTime = () => {
//   const dispatch = useDispatch();

//   const fetchPeriodsData = async () => {
//     try {
//       const response = await axios.get(
//         `${routineUrlApi.getClassTime.url}`
//       );
//       if (response) {
//         dispatch(setClassTime(response?.data?.data));
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Error fetching data");
//     } 
//   };

//   return fetchPeriodsData;
// }



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

export const useFetchAllClass = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchAllClass = async () => {
      try {
        const response = await axios.get(`${academicUrlApi.getAllClass.url}`);
        dispatch(setClass(response?.data));
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching data");
      }
    };
    fetchAllClass();
  }, [role]); // Re-fetch when `role` changes
};

export const useFetchAllSection = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        const response = await axios.get(`${academicUrlApi.getAllSection.url}`);
        dispatch(setSection(response?.data));
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching data");
      }
    };
    fetchSectionData();
  }, [role]); // Re-fetch when `role` changes
};

export const useFetchAllSubject = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state?.auth?.user);

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        const response = await axios.get(`${academicUrlApi.getAllSubject.url}`);
        if (response) {
          dispatch(setSubject(response?.data));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching data");
      }
    };
    fetchSubjectData();
  }, [role]); // Re-fetch when `role` changes
};

export const useFetchAllExamType = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state?.auth?.user);

  useEffect(() => {
    const fetchExamTypeData = async () => {
      try {
        const response = await axios.get(`${routineUrlApi.getExamType.url}`);
        dispatch(setExamType(response?.data?.data));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch the data");
      }
    };
    fetchExamTypeData();
  }, [role]); // Re-fetch when `role` changes
};

export const useFetchAllGender = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state?.auth?.user);

  useEffect(() => {
    const fetchGenderData = async () => {
      try {
        const response = await axios.get(`${settingUrlApi.getAllGender.url}`);
        if (response) {
          dispatch(setGenders(response?.data?.data));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching data");
      }
    };
    fetchGenderData();
  }, [role]); // Re-fetch when `role` changes
};

export const useFetchAllBloodGroup = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state?.auth?.user);

  useEffect(() => {
    const fetchBloodGroupData = async () => {
      try {
        const response = await axios.get(`${settingUrlApi.getAllBloodGroup.url}`);
        if (response) {
          dispatch(setBloodGroups(response?.data?.data));
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error fetching data");
      }
    };
    fetchBloodGroupData();
  }, [role]); // Re-fetch when `role` changes
};

export const useFetchAllReligion = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state?.auth?.user);

  useEffect(() => {
    const fetchReligionData = async () => {
      try {
        const response = await axios.get(`${settingUrlApi.getAllReligion.url}`);
        if (response) {
          dispatch(setReligions(response?.data?.data));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching data");
      }
    };
    fetchReligionData();
  }, [role]); // Re-fetch when `role` changes
};

export const useFetchSchoolInformation = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state?.auth?.user);

  useEffect(() => {
    const fetchInstituteInformation = async () => {
      try {
        const response = await axios.get(
          `${mainUrlApi.instituteInfo.url}`
          //6788bb6b605207527119d8cd`
        );
        if (response) {
          dispatch(setInstitute(response?.data?.data));
        }
      } catch (error) {
        // console.error("Error fetching institute information:", error);
        toast.error(error.response?.data?.message || "school not found please contact admin");
      }
    };
    fetchInstituteInformation();
  }, [role]); // Re-fetch when `role` changes
};

export const useFetchAllClassTime = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchPeriodsData = async () => {
      try {
        const response = await axios.get(`${routineUrlApi.getClassTime.url}`);
        if (response) {
          dispatch(setClassTime(response?.data?.data));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching data");
      }
    };
    fetchPeriodsData();
  }, [role]); // Re-fetch when `role` changes
};
