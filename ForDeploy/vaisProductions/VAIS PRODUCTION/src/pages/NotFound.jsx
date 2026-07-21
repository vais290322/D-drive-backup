import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import { NotFoundImg } from "../assets";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4 text-center">
      <FaExclamationTriangle className="text-red-500 text-6xl mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        404 - Page Not Found
      </h1>
      <p className="text-gray-600 mb-6">
        Oops! The page you are looking for does not exist.
      </p>
      <img
        src={NotFoundImg}
        alt="404 error"
        className="rounded-lg shadow-lg mb-6 h-44 w-52"
      />
      <Link
        to="/"
        className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition-all"
      >
        Go Home
      </Link>
    </div>
  );
}
