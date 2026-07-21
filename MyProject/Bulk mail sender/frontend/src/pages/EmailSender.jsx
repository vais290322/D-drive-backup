import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// const API_URL = "https://collage.vaisacademy.com/bulkmail/api";
const API_URL = 'http://localhost:6085/api';

const EmailSender = () => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [footerName, setFooterName] = useState("");
  const [footerAddress, setFooterAddress] = useState("");
  const [footerPhone, setFooterPhone] = useState(""); 
  const [footerDepertment, setFooterDepertment] = useState(""); 
  const [footerMessage, setFooterMessage] = useState(""); 
  const [excelFile, setExcelFile] = useState(null);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop().toLowerCase();
    if (fileExt !== "xlsx" && fileExt !== "xls") {
      toast.error("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }

    setExcelFile(file);
    setLoading(true);

    const formData = new FormData();
    formData.append("excelFile", file);

    try {
      const response = await axios.post(`${API_URL}/extract-emails`, formData);
      setEmails(response.data.emails);
      toast.success(
        `Successfully extracted ${response.data.count} email addresses`
      );
      setStep(2);
    } catch (error) {
      console.error("Error uploading Excel file:", error);
      toast.error(
        error.response?.data?.message || "Error uploading Excel file"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop().toLowerCase();
    if (!["jpg", "jpeg", "png", "gif"].includes(fileExt)) {
      toast.error("Please upload a valid image file");
      return;
    }

    setLogo(file);

    // Create a preview
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAttachmentUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (files.length + attachments.length > 5) {
      toast.error("You can upload a maximum of 5 attachments");
      return;
    }

    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject || !body || emails.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Upload logo if selected
      let logoPath = null;
      if (logo) {
        const logoFormData = new FormData();
        logoFormData.append("logo", logo);

        const logoResponse = await axios.post(
          `${API_URL}/upload-logo`,
          logoFormData
        );
        logoPath = logoResponse.data.logo.path;
      }

      // Prepare form data for sending emails
      // In the handleSubmit function, ensure the phone is being appended to formData
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("body", body);
      formData.append("footer[name]", footerName);
      formData.append("footer[address]", footerAddress);
      formData.append("footer[phone]", footerPhone); 
      formData.append("footer[depertment]", footerDepertment); 
      formData.append("footer[message]", footerMessage); 
      if (logoPath) {
        formData.append("footer[logo]", logoPath);
      }

      emails.forEach((email) => {
        formData.append("recipients[]", email);
      });

      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      // Send emails
      const response = await axios.post(`${API_URL}/send-emails`, formData);

      toast.success("Emails sent successfully!");

      // Reset form
      setSubject("");
      setBody("");
      setFooterName("");
      setFooterAddress("");
      setExcelFile(null);
      setLogo(null);
      setLogoPreview("");
      setAttachments([]);
      setEmails([]);
      setStep(1);
      setFooterPhone("");
      setFooterMessage("");
      setFooterDepertment("");
      
    } catch (error) {
      console.error("Error sending emails:", error);
      toast.error(error.response?.data?.message || "Error sending emails");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Email Campaign</h1>

      <div className="mb-6">
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            1
          </div>
          <div
            className={`flex-1 h-1 mx-2 ${
              step >= 2 ? "bg-blue-600" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            2
          </div>
          <div
            className={`flex-1 h-1 mx-2 ${
              step >= 3 ? "bg-blue-600" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            3
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm">Upload Recipients</span>
          <span className="text-sm">Compose Email</span>
          <span className="text-sm">Review & Send</span>
        </div>
      </div>

      <div className="card">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Upload Recipients</h2>
            <div className="form-group">
              <label className="block mb-2 font-medium">
                Upload Email List (Excel file)
              </label>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleExcelUpload}
                className="input-field"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Upload an Excel file containing email addresses
              </p>
            </div>

            {loading && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-2">Processing...</p>
              </div>
            )}

            {emails.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">
                  Extracted Emails ({emails.length})
                </h3>
                <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                  {emails.slice(0, 10).map((email, index) => (
                    <div key={index} className="py-1 border-b last:border-b-0">
                      {email}
                    </div>
                  ))}
                  {emails.length > 10 && (
                    <div className="py-1 text-center text-gray-500">
                      ...and {emails.length - 10} more
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setStep(2)}
                  >
                    Next: Compose Email
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Compose Email</h2>
            <div className="form-group">
              <label className="block mb-2 font-medium">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="input-field"
                placeholder="Enter email subject"
                required
              />
            </div>

            <div className="form-group">
              <label className="block mb-2 font-medium">Email Body</label>
              <textarea
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="input-field"
                placeholder="Enter email body"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label className="block mb-2 font-medium">Attachments</label>
              <input
                type="file"
                multiple
                onChange={handleAttachmentUpload}
                className="input-field"
              />
              <p className="mt-1 text-sm text-gray-500">
                You can upload up to 5 attachments
              </p>
            </div>

            {attachments.length > 0 && (
              <div className="mt-2">
                <h3 className="font-medium mb-2">Uploaded Attachments</h3>
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <span className="truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="font-medium mb-3">Footer Information</h3>

              <div className="form-group">
                <label className="block mb-2">Message (optional) </label>
                <input
                  type="text"
                  value={footerMessage}
                  onChange={(e) => setFooterMessage(e.target.value)}
                  className="input-field"
                  placeholder="Enter footer message"
                />
              </div>
              <div className="form-group">
                <label className="block mb-2">Name/Company</label>
                <input
                  type="text"
                  value={footerName}
                  onChange={(e) => setFooterName(e.target.value)}
                  className="input-field"
                  placeholder="Enter name or company name"
                />
              </div>

              <div className="form-group">
                <label className="block mb-2">Depertment</label>
                <input
                  type="text"
                  value={footerDepertment}
                  onChange={(e) => setFooterDepertment(e.target.value)}
                  className="input-field"
                  placeholder="Enter your department or designation or role"
                />
              </div>

              <div className="form-group">
                <label className="block mb-2">Phone Number</label>
                <input
                  type="text"
                  value={footerPhone}
                  onChange={(e) => setFooterPhone(e.target.value)}
                  className="input-field"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-group">
                <label className="block mb-2">Address</label>
                <textarea
                  rows={2}
                  value={footerAddress}
                  onChange={(e) => setFooterAddress(e.target.value)}
                  className="input-field"
                  placeholder="Enter address"
                ></textarea>
              </div>

              <div className="form-group">
                <label className="block mb-2">Logo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="input-field"
                />
              </div>

              {logoPreview && (
                <div className="mt-2">
                  <h3 className="font-medium mb-2">Logo Preview</h3>
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="max-w-xs max-h-32 border p-2 rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(3)}
              >
                Next: Review & Send
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Review & Send</h2>

            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Recipients</h3>
                <p>{emails.length} email addresses</p>
                <div className="mt-2 max-h-20 overflow-y-auto">
                  {emails.slice(0, 5).map((email, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {email}
                    </div>
                  ))}
                  {emails.length > 5 && (
                    <div className="text-sm text-gray-500">
                      ...and {emails.length - 5} more
                    </div>
                  )}
                </div>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Email Content</h3>
                <div className="mb-2">
                  <span className="font-medium">Subject:</span> {subject}
                </div>
                <div>
                  <span className="font-medium">Body:</span>
                  <div className="mt-1 p-2 border rounded-md bg-gray-50 whitespace-pre-wrap">
                    {body}
                  </div>
                </div>
              </div>

              {(footerName || footerAddress || logoPreview) && (
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Footer</h3>
                  {footerName && (
                    <div>
                      <span className="font-medium">Name:</span> {footerName}
                    </div>
                  )}
                  {footerPhone && (
                    <div>
                      <span className="font-medium">Phone:</span> {footerPhone}
                    </div>
                  )}
                  {footerAddress && (
                    <div className="mt-1">
                      <span className="font-medium">Address:</span>{" "}
                      {footerAddress}
                    </div>
                  )}
                  {logoPreview && (
                    <div className="mt-2">
                      <span className="font-medium">Logo:</span>
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="mt-1 max-w-xs max-h-20"
                      />
                    </div>
                  )}
                </div>
              )}

              {attachments.length > 0 && (
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Attachments</h3>
                  <ul className="list-disc list-inside">
                    {attachments.map((file, index) => (
                      <li key={index} className="text-sm">
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                    Sending...
                  </span>
                ) : (
                  "Send Emails"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailSender;
