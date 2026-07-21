
// import React, { useState } from "react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { Button } from "@/components/ui/button";

// const SignUpStep2Page = () => {
//   const [formData, setFormData] = useState({
//     instituteCertificateNo: "",
//     instituteRegistration: null,
//     institutePhoto1: null,
//     institutePhoto2: null,
//     institutePhoto3: null,
//     instituteLogo: null,
//     adminName: "",
//     adminPhoto: null,
//     adminSignature: null,
//     adminAddress: "",
//     adminContact: "",
//     adminEmail: "",
//     trusteeName: "",
//     trusteePhoto: null,
//     trusteeSignature: null,
//     trusteeAddress: "",
//     trusteeContact: "",
//     trusteeEmail: "",
//     paymentDetails: "",
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formData1 = new FormData();
//     for (const key in formData) {
//       formData1.append(key, formData[key]);
//     }

//     // Debugging output
//     for (const pair of formData1.entries()) {
//       console.log(pair[0], pair[1]);
//     }

//     // Add API submission logic here
//     console.log("Form data submitted!", formData1);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100 px-4 py-8 font-poppins">
//       <h1 className="text-2xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
//         Institute Sign-Up: Step 2
//       </h1>
//       <p className="text-lg text-center text-gray-600 mb-10">
//         Fill out the required details below to proceed with the registration process.
//       </p>

//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6"
//       >
//         <Accordion type="single" collapsible className="w-full">
//           <AccordionItem value="item-1">
//             <AccordionTrigger className="text-lg font-semibold text-gray-800 py-2">
//               Institute Details
//             </AccordionTrigger>
//             <AccordionContent className="text-gray-600 space-y-4">
//               <div>
//                 <label
//                   htmlFor="instituteCertificateNo"
//                   className="block font-medium text-black p-1"
//                 >
//                   Institute Certificate
//                 </label>
//                 <input
//                   id="instituteCertificateNo"
//                   type="text"
//                   name="instituteCertificateNo"
//                   value={formData.instituteCertificateNo}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="instituteRegistration"
//                   className="block font-medium text-black p-1"
//                 >
//                   Institute Registration Certificate Photo
//                 </label>
//                 <input
//                   id="instituteRegistration"
//                   type="file"
//                   name="instituteRegistration"
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                 />
//               </div>
//               {["institutePhoto1", "institutePhoto2", "institutePhoto3"].map(
//                 (photo, index) => (
//                   <div key={photo}>
//                     <label
//                       htmlFor={photo}
//                       className="block font-medium text-black p-1"
//                     >
//                       Institute's Photo {index + 1}
//                     </label>
//                     <input
//                       id={photo}
//                       type="file"
//                       name={photo}
//                       onChange={handleChange}
//                       className="w-full border border-gray-300 rounded-lg p-2"
//                     />
//                   </div>
//                 )
//               )}
//               <div>
//                 <label
//                   htmlFor="instituteLogo"
//                   className="block font-medium text-black p-1"
//                 >
//                   Institute's Logo
//                 </label>
//                 <input
//                   id="instituteLogo"
//                   type="file"
//                   name="instituteLogo"
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                 />
//               </div>
//             </AccordionContent>
//           </AccordionItem>

//           <AccordionItem value="item-2">
//             <AccordionTrigger className="text-lg font-semibold text-gray-800 py-2">
//               Admin's Details
//             </AccordionTrigger>
//             <AccordionContent className="text-black space-y-4">
//               <div>
//                 <label
//                   htmlFor="adminName"
//                   className="block font-medium text-black p-1"
//                 >
//                   Admin's Name
//                 </label>
//                 <input
//                   id="adminName"
//                   type="text"
//                   name="adminName"
//                   value={formData.adminName}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="adminPhoto"
//                   className="block font-medium text-black p-1"
//                 >
//                   Admin's Photo
//                 </label>
//                 <input
//                   id="adminPhoto"
//                   type="file"
//                   name="adminPhoto"
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="adminAddress"
//                   className="block font-medium text-black p-1"
//                 >
//                   Admin's Address
//                 </label>
//                 <textarea
//                   name="adminAddress"
//                   value={formData.adminAddress}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="adminContact"
//                   className="block font-medium text-black p-1"
//                 >
//                   Admin's Contact Number
//                 </label>
//                 <input
//                   type="text"
//                   name="adminContact"
//                   value={formData.adminContact}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="adminEmail"
//                   className="block font-medium text-black p-1"
//                 >
//                   Admin's Email
//                 </label>
//                 <input
//                   type="email"
//                   name="adminEmail"
//                   value={formData.adminEmail}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                 />
//               </div>
//             </AccordionContent>
//           </AccordionItem>

//           <AccordionItem value="item-3">
//             <AccordionTrigger className="text-lg font-semibold text-gray-800 py-2">
//               Trustee Details
//             </AccordionTrigger>
//             <AccordionContent className="text-black space-y-4">
//               <div>
//                 <label
//                   htmlFor="trusteeName"
//                   className="block font-medium text-black p-1"
//                 >
//                   Trustee Name
//                 </label>
//                 <input
//                   type="text"
//                   name="trusteeName"
//                   value={formData.trusteeName}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="trusteePhoto"
//                   className="block font-medium text-black p-1"
//                 >
//                   Trustee Photo
//                 </label>
//                 <input
//                   type="file"
//                   name="trusteePhoto"
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="trusteeSignature"
//                   className="block font-medium text-black p-1"
//                 >
//                   Trustee Signature
//                 </label>
//                 <input
//                   type="file"
//                   name="trusteeSignature"
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="trusteeAddress"
//                   className="block font-medium text-black p-1"
//                 >
//                   Trustee Address
//                 </label>
//                 <textarea
//                   name="trusteeAddress"
//                   value={formData.trusteeAddress}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="trusteeContact"
//                   className="block font-medium text-black p-1"
//                 >
//                   Trustee Contact Number
//                 </label>
//                 <input
//                   type="text"
//                   name="trusteeContact"
//                   value={formData.trusteeContact}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="trusteeEmail"
//                   className="block font-medium text-black p-1"
//                 >
//                   Trustee Email
//                 </label>
//                 <input
//                   type="email"
//                   name="trusteeEmail"
//                   value={formData.trusteeEmail}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                 />
//               </div>
//             </AccordionContent>
//           </AccordionItem>

//           <AccordionItem value="item-4">
//             <AccordionTrigger className="text-lg font-semibold text-gray-800 py-2">
//               Payment Details
//             </AccordionTrigger>
//             <AccordionContent className="text-black space-y-4">
//               <div>
//                 <label
//                   htmlFor="paymentDetails"
//                   className="block font-medium text-black p-1"
//                 >
//                   pay for further process
//                 </label>
//                 {/* <input
//                   id="paymentDetails"
//                   type="text"
//                   name="paymentDetails"
//                   value={formData.paymentDetails}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                 /> */}
//                 <Button className="bg-[#452B90] hover:bg-[#c29732] flex items-center" >Pay 300</Button>
//               </div>
//             </AccordionContent>
//           </AccordionItem>
//         </Accordion>

//         <div className="mt-8">
//           <button
//             type="submit"
//             className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 hover:bg-gradient-to-r hover:from-pink-500 hover:to-cyan-500 text-white rounded-lg shadow-md transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-100"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SignUpStep2Page;


import React, { useState } from "react";
import axios from "axios";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const SignUpStep2Page = () => {
  const [formData, setFormData] = useState({
    instituteCertificateNo: "",
    instituteRegistration: null,
    institutePhoto1: null,
    institutePhoto2: null,
    institutePhoto3: null,
    instituteLogo: null,
    adminName: "",
    adminPhoto: null,
    adminSignature: null,
    adminAddress: "",
    adminContact: "",
    adminEmail: "",
    trusteeName: "",
    trusteePhoto: null,
    trusteeSignature: null,
    trusteeAddress: "",
    trusteeContact: "",
    trusteeEmail: "",
    paymentDetails: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  // Function to handle Razorpay payment
  const handlePayment = async () => {
    try {
      // Get order details from the backend
      const response = await axios.post("http://localhost:5000/create-order", {
        amount: 300, // Payment amount in INR (smallest unit, e.g., 300 INR = 300 * 100 paise)
      });

      const { id, currency, amount } = response.data;

      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay Key ID
        amount: amount * 100, // Amount in paise
        currency: currency,
        name: "Institute Registration",
        description: "Payment for Institute Sign-Up",
        order_id: id,
        handler: function (response) {
          // Handle payment success
          // console.log("Payment Successful: ", response);
          alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
        },
        prefill: {
          name: formData.adminName,
          email: formData.adminEmail,
          contact: formData.adminContact,
        },
        theme: {
          color: "#452B90",
        },
      };

      // Open Razorpay payment gateway
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error initiating Razorpay payment:", error);
      alert("Error initiating payment");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData1 = new FormData();
    for (const key in formData) {
      formData1.append(key, formData[key]);
    }

    // Debugging output
    // for (const pair of formData1.entries()) {
    //   console.log(pair[0], pair[1]);
    // }

    // Add API submission logic here
    // console.log("Form data submitted!", formData1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100 px-4 py-8 font-poppins">
      <h1 className="text-2xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
        Institute Sign-Up: Step 2
      </h1>
      <p className="text-lg text-center text-gray-600 mb-10">
        Fill out the required details below to proceed with the registration process.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold text-gray-800 py-2">Institute Details</AccordionTrigger>
            <AccordionContent className="text-gray-600 space-y-4">
              <div>
                <label htmlFor="instituteCertificateNo" className="block font-medium text-black p-1">
                  Institute Certificate
                </label>
                <input
                  id="instituteCertificateNo"
                  type="text"
                  name="instituteCertificateNo"
                  value={formData.instituteCertificateNo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label htmlFor="instituteRegistration" className="block font-medium text-black p-1">
                  Institute Registration Certificate Photo
                </label>
                <input
                  id="instituteRegistration"
                  type="file"
                  name="instituteRegistration"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              {["institutePhoto1", "institutePhoto2", "institutePhoto3"].map((photo, index) => (
                <div key={photo}>
                  <label htmlFor={photo} className="block font-medium text-black p-1">
                    Institute's Photo {index + 1}
                  </label>
                  <input
                    id={photo}
                    type="file"
                    name={photo}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
              ))}
              <div>
                <label htmlFor="instituteLogo" className="block font-medium text-black p-1">
                  Institute's Logo
                </label>
                <input
                  id="instituteLogo"
                  type="file"
                  name="instituteLogo"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold text-gray-800 py-2">Admin's Details</AccordionTrigger>
            <AccordionContent className="text-black space-y-4">
              <div>
                <label htmlFor="adminName" className="block font-medium text-black p-1">
                  Admin's Name
                </label>
                <input
                  id="adminName"
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label htmlFor="adminPhoto" className="block font-medium text-black p-1">
                  Admin's Photo
                </label>
                <input
                  id="adminPhoto"
                  type="file"
                  name="adminPhoto"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label htmlFor="adminAddress" className="block font-medium text-black p-1">
                  Admin's Address
                </label>
                <textarea
                  name="adminAddress"
                  value={formData.adminAddress}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label htmlFor="adminContact" className="block font-medium text-black p-1">
                  Admin's Contact Number
                </label>
                <input
                  type="text"
                  name="adminContact"
                  value={formData.adminContact}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label htmlFor="adminEmail" className="block font-medium text-black p-1">
                  Admin's Email
                </label>
                <input
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold text-gray-800 py-2">Trustee Details</AccordionTrigger>
            <AccordionContent className="text-black space-y-4">
              <div>
                <label htmlFor="trusteeName" className="block font-medium text-black p-1">
                  Trustee Name
                </label>
                <input
                  type="text"
                  name="trusteeName"
                  value={formData.trusteeName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label htmlFor="trusteePhoto" className="block font-medium text-black p-1">
                  Trustee Photo
                </label>
                <input
                  type="file"
                  name="trusteePhoto"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label htmlFor="trusteeSignature" className="block font-medium text-black p-1">
                  Trustee Signature
                </label>
                <input
                  type="file"
                  name="trusteeSignature"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label htmlFor="trusteeAddress" className="block font-medium text-black p-1">
                  Trustee Address
                </label>
                <textarea
                  name="trusteeAddress"
                  value={formData.trusteeAddress}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label htmlFor="trusteeContact" className="block font-medium text-black p-1">
                  Trustee Contact Number
                </label>
                <input
                  type="text"
                  name="trusteeContact"
                  value={formData.trusteeContact}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label htmlFor="trusteeEmail" className="block font-medium text-black p-1">
                  Trustee Email
                </label>
                <input
                  type="email"
                  name="trusteeEmail"
                  value={formData.trusteeEmail}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-semibold text-gray-800 py-2">Payment Details</AccordionTrigger>
            <AccordionContent className="text-black space-y-4">
              <div>
                <label htmlFor="paymentDetails" className="block font-medium text-black p-1">
                  Pay for further process
                </label>
                <Button
                  onClick={handlePayment}
                  className="bg-[#452B90] hover:bg-[#c29732] flex items-center"
                >
                  Pay 300
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-8">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 hover:bg-gradient-to-r hover:from-pink-500 hover:to-cyan-500 text-white rounded-lg shadow-md transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-100"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpStep2Page;
