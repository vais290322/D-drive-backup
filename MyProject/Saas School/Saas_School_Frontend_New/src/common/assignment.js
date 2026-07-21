// const assignmentApi = "http://192.168.0.156:8089/api/assignments";
// const assignmentApi = "https://collage.vaisacademy.com/service2/api/assignments";

const baseUrl = import.meta.env.VITE_REACT_SERVICE2_URL

const assignmentApi = `${baseUrl}/api/assignments`;

const assignmentUrlApi = {
  getAllAssignment: {
    url: `${assignmentApi}`,
  },
  postAssignment: {
    url: `${assignmentApi}`,
  },
  deleteAssignment: {
    url: `${assignmentApi}`,
  },
  putAssignment: {
    url: `${assignmentApi}`,
  },
};
export default assignmentUrlApi;
