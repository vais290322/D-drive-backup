import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export function CreateBlogBtn() {
  const { user } = useSelector((s) => s.auth);
  if (!user) return null;
  return (
    <button className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-md">
      <Link to="/blog/create">Create</Link>
    </button>
  );
}
