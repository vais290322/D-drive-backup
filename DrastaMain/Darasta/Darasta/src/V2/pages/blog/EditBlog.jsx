import { editBlog } from "@/V2/app/features/blogs/blogsAsyncThunk";
import { selectBlogById } from "@/V2/app/features/blogs/blogsSelector";
import { BlogForm } from "@/V2/components/blog";
import { useToast } from "@/context/ToastContext";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export function EditBlog() {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = useSelector(selectBlogById(id));

  if (!blog) {
    return (
      <div className="p-8 text-center text-gray-500">
        Blog not found
      </div>
    );
  }

  const handleUpdate = async (blogData) => {
    try {
      await dispatch(editBlog({ id, blogData })).unwrap();
      showToast("Blog updated successfully!", "success");
      navigate(`/blog/${id}`);
    } catch (err) {
      showToast("Failed to update blog", "error");
    }
  };

  return (
    <div className="p-4">
      <BlogForm
        initialTitle={blog.title}
        initialContent={blog.content}
        initialBanner={blog.bannerImageUrl}
        onSubmit={handleUpdate}
        submitText="Update Post"
      />
    </div>
  );
}
