import React,{useState} from 'react'
import Linked_service from "../../../assets/Home_images/home page/linked_services.png";

function Getintouch() {
    const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let errors = {};
    if (!firstName) errors.firstName = "First Name is required";
    if (!lastName) errors.lastName = "Last Name is required";
    if (!email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email format";
    if (!phone) errors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(phone)) errors.phone = "Invalid phone number";
    if (!message) errors.message = "Message is required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const formData = { firstName, lastName, email, phone, message };
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      await response.json();
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form");
    }
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  return (
     <div className="relative w-full flex flex-col md:flex-row justify-center px-6 sm:px-12 md:p-32 gap-10">
            <div className="w-full md:w-[60%]">
              <div className="flex flex-col gap-6 md:gap-10">
                <img src={Linked_service} alt="no image" className="h-10 w-10" />
                <strong className="text-3xl sm:text-4xl md:text-5xl">
                  Get in Touch For <span className="text-blue-500">Trusted Security</span>
                </strong>
                <p className="pr-4 md:pr-24 text-xs sm:text-sm">
                  For any inquiries about our security, maintenance, and manpower services, feel free to reach out. Use the form below to connect with our team, and we’ll get back to you promptly with the right solutions tailored to your needs.
                </p>
              </div>
              <form className="flex flex-col gap-4 mt-6 md:mt-10" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row gap-4">
                  <input name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" placeholder="First Name" className="border py-3 px-6 w-full md:w-[46%] rounded-3xl outline-none" />
                  <input name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" placeholder="Last Name" className="border py-3 px-6 w-full md:w-[46%] rounded-3xl outline-none" />
                </div>
                <input name="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="border py-3 px-6 w-full rounded-3xl outline-none" />
                <input name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} type="number" placeholder="Phone No" className="border py-3 px-6 w-full rounded-3xl outline-none" />
                <textarea name="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" className="border py-3 px-6 h-32 w-full rounded-xl outline-none" />
                <button type="submit" className="border-none rounded-3xl text-xs sm:text-sm bg-blue-600 text-white hover:bg-blue-700 py-3 px-10 mx-auto">Submit Your Request Now →</button>
              </form>
            </div>
            <div className="w-full md:w-[40%] h-full md:h-full">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.3488234352435!2d88.3966530753011!3d22.59365477947664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02770006ed7419%3A0x66c79f9ab43ba73!2sAB%2079!5e1!3m2!1sen!2sin!4v1740828900305!5m2!1sen!2sin" width="100%" height="650" className="border-2 rounded-xl"></iframe>
            </div>
          </div>
  )
}

export default Getintouch