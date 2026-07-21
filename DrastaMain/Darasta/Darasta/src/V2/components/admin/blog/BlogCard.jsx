export function BlogCard({ data, actions = [] }) {
  const authorName = data.author || data.requestedBy?.name || "Unknown";
  const avatar = data.avatarUrl || "https://i.pravatar.cc/150?img=12";

  return (
    <div className="flex flex-col md:flex-row items-center bg-[#F9EBE9] p-3 border border-[#9225211a] rounded-md">
      
      {/* Avatar + Name (fixed width) */}
      <div className="flex items-center space-x-3 w-full md:w-1/4">
        <img
          src={avatar}
          alt={authorName}
          className="w-10 h-10 rounded-full object-cover bg-gray-200"
        />
        <div className="truncate">
          <p className="text-sm text-gray-500">Requested By</p>
          <p className="font-medium truncate">{authorName}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px bg-[#9225211a] h-12 mx-4" />

      {/* Title (takes remaining space) */}
      <div className="flex-1 w-full md:w-2/4">
        <p className="text-sm text-gray-500">Title</p>
        <p className="font-medium line-clamp-2">{data.title}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-2 w-full md:w-1/4 mt-3 md:mt-0">
        {actions.map(({ label, icon: Icon, onClick, triggerElement }) => (
          triggerElement ? (
            /* custom trigger (e.g. DeleteConfirmDialog) */
            <span key={label}>{triggerElement()}</span>
          ) : (
            <button
              key={label}
              title={label}
              onClick={onClick}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <Icon size={18} />
            </button>
          )
        ))}
      </div>
    </div>
  );
}
