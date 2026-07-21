import { getHTMLContent } from "@/V2/utils";
import { User, Clock, Calendar, Tag } from "lucide-react";

export function BlogView({ data }) {
  if (!data) return null;

  return (
    <div className="p-0 md:p-4 max-w-3xl mx-auto">
      {/* Banner Image */}
      {data.bannerImageUrl && (
        <div className="flex justify-center mb-6">
          <img
            src={data.bannerImageUrl}
            alt="Banner"
            className="h-64 w-full object-cover rounded-lg shadow"
          />
        </div>
      )}

      {/* Title */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Title</p>
        <h1 className="font-bold text-gray-900 leading-tight text-2xl md:text-4xl break-words">
          {data.title}
        </h1>
      </div>

      {/* Meta Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 py-4 rounded-lg bg-gray-50">
        {data.author && (
          <div className="flex items-start space-x-2">
            <User className="w-5 h-5 text-gray-500 mt-1" />
            <div className="min-w-0">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Author</p>
              <p className="text-gray-900 font-medium mt-1 truncate">{data.author}</p>
            </div>
          </div>
        )}

        {data.readTime && (
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Read Time</p>
              <p className="text-gray-900 font-medium mt-1">{data.readTime}</p>
            </div>
          </div>
        )}

        {data.publishDate && (
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Published</p>
              <p className="text-gray-900 font-medium mt-1">
                {new Date(data.publishDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {data.status !== undefined && (
          <div className="flex items-center space-x-2">
            <Tag className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Status</p>
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                  data.publish ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {data.publish ? "Published" : "Draft"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Content</p>
        <div className="prose prose-lg max-w-none border-dotted border-2 p-4 rounded-md bg-white max-h-[300px] overflow-y-auto">
          <div
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={getHTMLContent(data.content)}
          />
        </div>
      </div>
    </div>
  );
}
