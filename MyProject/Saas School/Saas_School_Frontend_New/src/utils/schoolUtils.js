// Simple utility to get/set the school ID
export const getSchoolId = () => {
  return localStorage.getItem('schoolId') || 'default-school-id';
};

export const setSchoolId = (id) => {
  localStorage.setItem('schoolId', id);
};