import { useNavigate } from "react-router-dom";

export const useScrollSection = () => {
  const navigate = useNavigate();

  return (section) => {
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/home`);
    }
  };
};
