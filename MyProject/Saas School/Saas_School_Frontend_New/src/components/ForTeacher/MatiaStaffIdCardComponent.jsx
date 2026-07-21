import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import teacherIDCard from "../../assets/teacherIDCard.jpg";

const MatiaStaffIdCardComponent = ({
  photoUrl,
  teacherName = "",
  designation = "",
  address = "Matia",
  mobile = "+91 8436832600",
  bloodGroup = "",
  teachersCode = "",
  open,
  onOpenChange,
}) => {
  const cardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const teacherPhotoUrl = photoUrl || "https://picsum.photos/200/240?random=1";

  const downloadCard = async (type = "png") => {
    try {
      setIsDownloading(true);

      await document.fonts.ready;

      const node = cardRef.current;

      // clone the card
      const clone = node.cloneNode(true);

      // put it in a clean container
      const wrapper = document.createElement("div");
      wrapper.style.position = "fixed";
      wrapper.style.left = "-9999px";
      wrapper.style.top = "0";
      wrapper.style.background = "white";

      clone.style.margin = "0";
      clone.style.transform = "none";

      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      document.body.removeChild(wrapper);

      const link = document.createElement("a");
      link.download = `id-card-${teacherName}-${teachersCode}.${type}`;
      link.href =
        type === "jpg"
          ? canvas.toDataURL("image/jpeg")
          : canvas.toDataURL("image/png");

      link.click();
    } catch (error) {
      console.error("ID card download failed", error);
    } finally {
      setIsDownloading(false);
      onOpenChange(false);
    }
  };

  const labelStyle = {
    position: "absolute",
    left: 85,
    width: 200,
    color: "#0b2d6b",
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: 1.1, // ✅ IMPORTANT (number, not px string)
    fontFamily: "Arial, sans-serif", // ✅ IMPORTANT
    wordBreak: "break-word",
    whiteSpace: "normal",
  };

  const textStyle = {
    position: "absolute",
    left: 200,
    width: 200,
    color: "#0b2d6b",
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: 1.1, // ✅ IMPORTANT (number, not px string)
    fontFamily: "Arial, sans-serif", // ✅ IMPORTANT
    wordBreak: "break-word",
    whiteSpace: "normal",
  };

  const nameStyle = {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 bg-gray-100">
      <div
        ref={cardRef}
        style={{
          width: 420,
          height: 640,
          position: "relative",
          backgroundImage: `url(${teacherIDCard})`,
          backgroundSize: "cover",
          // backgroundPosition: "center",
          boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
          borderRadius: 6,
        }}
      >
        <img
          src={teacherPhotoUrl}
          alt="teacher"
          crossOrigin="anonymous"
          style={{
            position: "absolute",
            left: "49.9%",
            top: 175,
            transform: "translateX(-50%)",
            width: 160,
            height: 160,
            objectFit: "cover",
            objectPosition: "center top",
            borderRadius: "50%",
          }}
        />

        {/* Teacher Name */}
        <div style={{ ...nameStyle, top: 356 }}>
          <div
            style={{
              margin: "0 auto",
              color: "#d91204",
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: 1.1, // ✅ IMPORTANT (number, not px string)
              fontFamily: "Arial, sans-serif", // ✅ IMPORTANT
              wordBreak: "break-word",
              whiteSpace: "normal",
            }}
          >
            {teacherName}
          </div>
        </div>

        {/* Designation */}
        <div style={{ ...labelStyle, top: 403 }}>Designation</div>
        <div style={{ ...textStyle, top: 403 }}>: {" "}{designation}</div>

        {/* Address */}
        <div style={{ ...labelStyle, top: 432 }}>Address</div>
        <div style={{ ...textStyle, top: 432 }}>: {" "}{address}</div>

        {/* Mobile */}
        <div style={{ ...labelStyle, top: 461 }}>Mobile</div>
        <div style={{ ...textStyle, top: 461 }}>: {" "}{mobile}</div>

        {/* Blood Group */}
        <div style={{ ...labelStyle, top: 490 }}>Blood Group</div>
        <div style={{ ...textStyle, top: 490 }}>: {" "}{bloodGroup}</div>
      </div>
      {/* download buttons */}
      <div className="flex gap-3">
        <button
          disabled={isDownloading}
          onClick={() => downloadCard("png")}
          className={`px-4 py-2 rounded text-white
            ${isDownloading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 cursor-pointer"}
          `}
        >
          {isDownloading ? "Generating..." : "Download PNG"}
        </button>

        <button
          disabled={isDownloading}
          onClick={() => downloadCard("jpg")}
          className={`px-4 py-2 rounded text-white
            ${isDownloading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 cursor-pointer"}
          `}
        >
          {isDownloading ? "Generating..." : "Download JPG"}
        </button>
      </div>
    </div>
  );
};

export default MatiaStaffIdCardComponent;
