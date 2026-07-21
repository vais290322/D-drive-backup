import { useEffect, useState } from "react";
import api from "@/V2/service";
import { getFormattedDate } from "@/V2/utils";
import { Link as RouterLink } from "react-router-dom";

export function HomeNoticeSection() {
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const {
          data: { data },
        } = await api.get("/notice/primary");
        if (data?.showNotice) {
          setNotice(data);
        }
      } catch (error) {
        console.error("Failed to fetch notice:", error);
      }
    };
    fetchNotice();
  }, []);

  return (
    <section className="bg-[#F3C30433] w-full py-3 overflow-hidden border-t border-b border-yellow-300 flex items-center">
      <div className="sm:pl-[150px] mx-auto gap-4 px-4">
        <h2 className="text-[20px] sm:text-[28px] font-extrabold text-[#972626] flex-shrink-0">
          Notice:
        </h2>
      </div>
      {notice && (
        <div className="relative w-full h-[36px] flex items-center overflow-hidden">
          <marquee
            behavior="scroll"
            direction="left"
            scrollamount="8"
            className="w-full whitespace-nowrap flex items-center gap-8 text-[#222] font-medium text-base sm:text-lg"
          >
            <span>{notice.content}</span>
            {notice.redirectUrl && (
              <RouterLink
                to={notice.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline font-semibold ml-2"
              >
                Click Here
              </RouterLink>
            )}
            {notice.date && (
              <span className="text-sm text-gray-600 ml-2">
                ({getFormattedDate(notice.date)})
              </span>
            )}
          </marquee>
        </div>
      )}
    </section>
  );
}
