import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import idcard from "../../assets/idcard.jpeg";



const MatiaIdCardComponent = ({
  photoUrl,
  studentName = "Ishan Hossain",
  fatherName = "Nasir Hosen Mondal",
  admissionNo = "1120022009",
  address = "Matia",
  mobile = "+91 8436832600",
  open,
  onOpenChange,
}) => {

  const cardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);


  const studentPhoto = photoUrl || "https://picsum.photos/200/240?random=1";


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
        backgroundColor: null
      });

      document.body.removeChild(wrapper);

      const link = document.createElement("a");
      link.download = `id-card-${studentName}-${admissionNo}.${type}`;
      link.href =
        type === "jpg"
          ? canvas.toDataURL("image/jpeg", 0.95)
          : canvas.toDataURL("image/png");

      link.click();

    } catch (error) {
      console.error("ID card download failed", error);
    } finally {
      setIsDownloading(false);
      onOpenChange(false);
    }
  };


  const textStyle = {
    position: "absolute",
    left: 185,
    width: 200,
    color: "#0b2d6b",
    fontWeight: 600,
    fontSize: "15px",
    lineHeight: 1.1,           // ✅ IMPORTANT (number, not px string)
    fontFamily: "Arial, sans-serif", // ✅ IMPORTANT
    wordBreak: "break-word",
    whiteSpace: "normal",
  };


  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 bg-gray-100">

      <div
        ref={cardRef}
        style={{
          width: 420,
          height: 640,
          position: "relative",
          backgroundImage: `url(${idcard})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
          borderRadius: 6,
        }}
      >
        {/* student photo */}
        <img
          src={studentPhoto}
          alt="student"
          crossOrigin="anonymous"
          style={{
            position: "absolute",
            left: "50.5%",
            top: 236,
            transform: "translateX(-50%)",
            width: 135,
            height: 164,
            objectFit: "cover",
          }}
        />

        {/* Student Name */}
        <div style={{ ...textStyle, top: 404 }}>
          {studentName}
        </div>

        {/* Father Name */}
        <div style={{ ...textStyle, top: 434 }}>
          {fatherName}
        </div>

        {/* Admission No */}
        <div style={{ ...textStyle, top: 464 }}>
          {admissionNo}
        </div>

        {/* Address */}
        <div style={{ ...textStyle, top: 494 }}>
          {address}
        </div>

        {/* Mobile */}
        <div style={{ ...textStyle, top: 524 }}>
          {mobile}
        </div>

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

export default MatiaIdCardComponent;
