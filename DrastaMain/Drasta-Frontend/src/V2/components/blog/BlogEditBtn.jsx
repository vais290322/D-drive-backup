import { blogsAction } from "@/V2/app/features/blogs/blogsSlice";
import { Edit } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
export function BlogEditBtn({ id }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const goEdit = () => {
    dispatch(blogsAction.selectBlog(id));
    navigate(`/blog/edit/${id}`);
  };

  return (
    <button
      onClick={goEdit}
      className="text-blue-600 p-1 rounded-full hover:scale-110 transition"
      aria-label="Edit"
    >
      <Edit size={20} />
    </button>
  );
}
