import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import mainUrlApi from "@/common/main";

const InstituteInformationPage = () => {
  const { theme } = useTheme();
  const role = useSelector((state) => state.auth.user);
  const [instituteInformation, setInstituteInformation] = useState([]);
  // console.log("instituteInformation : ", instituteInformation);
  const [input, setInput] = useState({
    schoolName: "",
    schoolCode: "",
    schoolRegistrationNumber: "",
    schoolAddress: "",
    schoolEmail: "",
    schoolPhone: "",
    schoolWebsite: "",
    schoolLogo: null,
    schoolImage: null,
    schoolDescription: "",
    schoolPrincipalName: "",
    schoolPrincipalEmail: "",
    schoolPrincipalPhone: "",
  });

  const changeEventHandler = (e) => {
    const { name, value, files } = e.target;
    setInput({
      ...input,
      [name]: files ? files[0] : value,
    });
  };

  const addInstituteInformation = async (e) => {
    e.preventDefault();

    // Create FormData object
    const formData = new FormData();
    for (const key in input) {
      formData.append(key, input[key]);
    }

    try {
      // Make the API request
      const response = await axios.post(
        `${mainUrlApi.instituteInfo.url}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log("Response:", response);
      if (response) {
        toast.success("institute information submitted successfully.");
      }
    } catch (error) {
      console.error("Error submitting institute information:", error);
      toast.error("Failed to submit institute information.");
    }
  };

  const fetchInstituteInformation = async () => {
    try {
      const response = await axios.get(
        `${mainUrlApi.instituteInfo.url}`
        //6788bb6b605207527119d8cd
      );
      // setSubmittedData(response.data.data);
      if (response) setInstituteInformation(response.data.data);
      // console.log("Response:", response);
    } catch (error) {
      console.error("Error fetching institute information:", error);
    }
  };

  useEffect(() => {
    fetchInstituteInformation();
  }, []);

  return (
    <div className={` ${theme === "light" ? "dark" : "light"}  min-h-screen`}>
      <div
        className={` ${
          theme === "light"
            ? "border-[rgba(193,193,193,0.3)]"
            : "border-slate-200"
        } mt-4 font-poppins border-[1px]  rounded-[0.675rem] mx-4 sm:mx-14 `}
      >
        <div
          className={`flex justify-between items-center p-3 sm:p-4 border-b-[1px] ${
            theme === "light"
              ? "border-[rgba(193,193,193,0.3)] bg-[#262626] text-white"
              : "bg-white"
          } `}
        >
          <span className="text-[1rem] sm:text-[1.5rem] font-bold font-poppins">
            Institute Information
          </span>
          {!instituteInformation && ["admin", "edp", "vais"]?.includes(role) && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#452B90] hover:bg-[#c29732] text-white">
                  <FaPlus /> Add Institute Information
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-10 sm:max-w-[36%]">
                <DialogHeader>
                  <DialogTitle>Write institute details</DialogTitle>
                </DialogHeader>

                <form onSubmit={addInstituteInformation}>
                  <div className="grid grid-cols-2 gap-6 py-4">
                    {/* Form Fields */}
                    {[
                      { label: "Institute's Name", name: "schoolName" },
                      { label: "Institute's Code", name: "schoolCode" },
                      {
                        label: "Registration Number",
                        name: "schoolRegistrationNumber",
                      },
                      {
                        label: "Address",
                        name: "schoolAddress",
                        type: "textarea",
                      },
                      { label: "Email", name: "schoolEmail", type: "email" },
                      { label: "Phone Number", name: "schoolPhone" },
                      {
                        label: "Website URL",
                        name: "schoolWebsite",
                        optional: true,
                      },
                      {
                        label: "Description",
                        name: "schoolDescription",
                        type: "textarea",
                      },
                      {
                        label: "Admin's Name",
                        name: "schoolPrincipalName",
                      },
                      {
                        label: "Admin's Email",
                        name: "schoolPrincipalEmail",
                        type: "email",
                      },
                      {
                        label: "Admin  's Phone",
                        name: "schoolPrincipalPhone",
                      },
                      {
                        label: "institute's Image",
                        name: "schoolImage",
                        type: "file",
                      },
                      {
                        label: "Institute's Logo",
                        name: "schoolLogo",
                        type: "file",
                      },
                    ].map(({ label, name, type = "text", optional }) => (
                      <div key={name} className="flex flex-col gap-2">
                        <Label htmlFor={name}>
                          {label}
                          {!optional ? (
                            <sup className="text-red-600">*</sup>
                          ) : (
                            " (optional)"
                          )}
                        </Label>
                        {type === "textarea" ? (
                          <textarea
                            id={name}
                            name={name}
                            value={input[name]}
                            onChange={changeEventHandler}
                            className="border border-slate-200 rounded-md"
                            required={!optional}
                          />
                        ) : (
                          <Input
                            type={type}
                            id={name}
                            name={name}
                            value={type === "file" ? undefined : input[name]}
                            onChange={changeEventHandler}
                            required={!optional}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-[#452B90] hover:bg-[#c29732]"
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div
          className={`mb-20 p-6 ${
            theme === "light" ? "bg-[#262626] text-white" : "bg-white"
          } rounded-md`}
        >
          {instituteInformation.length > 0 ? (
            instituteInformation.map((institute, index) => (
              <div
                key={index}
                className="p-4 border border-gray-300 rounded-lg shadow-sm mb-6 bg-gray-50"
              >
                <div className="flex flex-wrap gap-6">
                  {/* Left Column: Images */}
                  <div className="w-full sm:w-1/3 flex flex-col items-center">
                    {institute.schoolLogo && (
                      <img
                        src={institute.schoolLogo}
                        alt="School Logo"
                        className="w-32 h-32 rounded-md border border-gray-200 mb-4"
                      />
                    )}
                    {institute.schoolImage && (
                      <img
                        src={institute.schoolImage}
                        alt="School Image"
                        className="w-full max-w-sm rounded-md border border-gray-200"
                      />
                    )}
                  </div>

                  {/* Right Column: Details */}
                  <div className="w-full sm:w-2/3">
                    <h2 className="text-xl font-semibold text-purple-700 mb-4">
                      {institute.schoolName || "Institute Name Not Available"}
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong>Registration Number:</strong>
                        <p>{institute.schoolRegistrationNumber || "N/A"}</p>
                      </div>
                      <div>
                        <strong>Code:</strong>
                        <p>{institute.schoolCode || "N/A"}</p>
                      </div>
                      <div>
                        <strong>Address:</strong>
                        <p>{institute.schoolAddress || "N/A"}</p>
                      </div>
                      <div>
                        <strong>Email:</strong>
                        <p>{institute.schoolEmail || "N/A"}</p>
                      </div>
                      <div>
                        <strong>Phone:</strong>
                        <p>{institute.schoolPhone || "N/A"}</p>
                      </div>
                      <div>
                        <strong>Website:</strong>
                        <a
                          href={institute.schoolWebsite || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          {institute.schoolWebsite || "N/A"}
                        </a>
                      </div>
                      <div>
                        <strong>Description:</strong>
                        <p>{institute.schoolDescription || "N/A"}</p>
                      </div>
                      <div>
                        <strong>Principal's Name:</strong>
                        <p>{institute.schoolPrincipalName || "N/A"}</p>
                      </div>
                      <div>
                        <strong>Principal's Email:</strong>
                        <p>{institute.schoolPrincipalEmail || "N/A"}</p>
                      </div>
                      <div>
                        <strong>Principal's Phone:</strong>
                        <p>{institute.schoolPrincipalPhone || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No Institute Information Available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstituteInformationPage;
