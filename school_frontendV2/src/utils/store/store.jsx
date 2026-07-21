import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage
import classSlice from "../academic/classSlice";
import sectionSlice from "../academic/sectionSlice";
import subjectSlice from "../academic/subjectSlice";
import subjectAssignSlice from "../academic/subjectAssignSlice";
import classRoomSlice from "../academic/classRoomSlice";
import classTimeSlice from "../routines/classTimeSlice";
import classRoutine from "../routines/classRoutineSlice";
import examTypeSlice from "../routines/examTypeSlice";
import examRoutineSlice from "../routines/examRoutineSlice";
import bookCategorySlice from "../library/bookCategorySlice";
import allBooksSlice from "../library/addBookSlice";
import settingsSlice from "../settings/settingsSlice";
import studentInfoSlice from "../studentInformation/studentInfoSlice";
import teacherInformationSlice from "../teacher/teacherInformationSlice";
import attendanceSlice from "../attendance/attendanceSlice";
import resultSlice from "../result/resultSlice";
import authSlice from "../auth/authSlice";
import instituteSlice from "../Institute/instituteSlice";
import eventSlice from "../event/eventSlice";
import tutionFeesSlice from "../fees/tutionFees";
import studentFeesSlice from "../fees/studentFeesSlice";
import tutionFeeModeSlice from "../fees/tutionFeeModeSlice";



// Persist configuration
const persistConfig = {
  key: "root", // Root key for the persisted state
  storage, // Use localStorage to persist state
  whitelist: ["class", "section", "subject", "subjectAssign", "classRoom","classTime", "classRoutine","examType","bookCategory","allBooks","examRoutine", "settings","studentInfo","teacherInfo","attendance","result","auth","institute", "event","tutionFees","studentFees","tutionFeeMode"], // List the reducers you want to persist
};

// Combine all reducers
const rootReducer = combineReducers({
  class: classSlice,
  section: sectionSlice,
  subject: subjectSlice,
  subjectAssign: subjectAssignSlice,
  classRoom: classRoomSlice,
  classTime: classTimeSlice,
  classRoutine: classRoutine,
  examType: examTypeSlice,
  bookCategory: bookCategorySlice,
  allBooks: allBooksSlice,
  examRoutine: examRoutineSlice,
  settings: settingsSlice,
  studentInfo: studentInfoSlice,
  teacherInfo: teacherInformationSlice,
  attendance: attendanceSlice,
  result: resultSlice,
  auth: authSlice,
  institute: instituteSlice,
  event: eventSlice,
  tutionFees: tutionFeesSlice,
  studentFees: studentFeesSlice,
  tutionFeeMode: tutionFeeModeSlice,
  
 

});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

// Export persistor for integration with PersistGate
export const persistor = persistStore(store);

export default store;
