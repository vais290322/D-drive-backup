// import TrainingTheme from "../pages/TrainingTheme";
const config = {
    advisorUrl: `${import.meta.env.VITE_REACT_BASE_URL}/advisor`,
    expertUrl: `${import.meta.env.VITE_REACT_BASE_URL}/experts`,
    trusteeUrl: `${import.meta.env.VITE_REACT_BASE_URL}/trustees`,
    superAdvisorUrl: `${import.meta.env.VITE_REACT_BASE_URL}/superadvisors`,
    adminUrl: `${import.meta.env.VITE_REACT_BASE_URL}/administration`,
      internUrl: `${import.meta.env.VITE_REACT_BASE_URL}/visitor-intern`,
      newsUrl: `${import.meta.env.VITE_REACT_BASE_URL}/data-news`,
      researchProjectUrl: `${import.meta.env.VITE_REACT_BASE_URL}/research-project`,
      researchThemeUrl: `${import.meta.env.VITE_REACT_BASE_URL}/research-theme`,
      trainingThemeUrl: `${import.meta.env.VITE_REACT_BASE_URL}/training-theme`,
      contactUsUrl: `${import.meta.env.VITE_REACT_BASE_URL}/contact-us`,
}
export const getAdvisor = {
   advisorUrl: `${config.advisorUrl}`,
};
export const getExpert = {
   expertUrl: `${config.expertUrl}`,
};
export const getTrustee = {
   trusteeUrl: `${config.trusteeUrl}`,
};
export const getSuperAdvisor ={
  superAdvisorUrl: `${config.superAdvisorUrl}`,
};
export const getAdmin = {
  adminUrl: `${config.adminUrl}`,
};
export const getIntern = {
  internUrl: `${config.internUrl}`,
};
export const getNews = {
  newsUrl: `${config.newsUrl}`,
};
export const getResearchProject = {
  researchProjectUrl: `${config.researchProjectUrl}`,
};
export const getResearchTheme = {
  researchThemeUrl: `${config.researchThemeUrl}`,
};
export const getTrainingTheme = {
  trainingThemeUrl: `${config.trainingThemeUrl}`,
};
export const getContactUs = {
  contactUsUrl: `${config.contactUsUrl}`,
};






