import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// const API_URL = "http://localhost:6085/api";
const API_URL = "https://server2.vais.co.in/testb/api";

const EmailSender = () => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [footerName, setFooterName] = useState("");
  const [footerAddress, setFooterAddress] = useState("");
  const [footerPhone, setFooterPhone] = useState("");
  const [footerDepertment, setFooterDepertment] = useState("");
  const [footerMessage, setFooterMessage] = useState("");
  const [footerFacebook, setFooterFacebook] = useState("");
  const [footerInstagram, setFooterInstagram] = useState("");
  const [footerYoutube, setFooterYoutube] = useState("");
  const [footerWebsite, setFooterWebsite] = useState("");
  const [excelFile, setExcelFile] = useState(null);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [profileLogoPath, setProfileLogoPath] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [excelEmails, setExcelEmails] = useState([]);
  const [manualEmails, setManualEmails] = useState([]);
  const [manualInput, setManualInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Mail accounts for sender selection
  const [mailAccounts, setMailAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");

  // Combined email list
  const allEmails = [...new Set([...excelEmails, ...manualEmails])];

  // Fetch user's mail accounts
  useEffect(() => {
    axios.get(`${API_URL}/mail-accounts`).then((res) => {
      if (res.data.success) {
        setMailAccounts(res.data.accounts);
        if (res.data.accounts.length > 0) {
          setSelectedAccountId(res.data.accounts[0]._id);
        }
      }
    }).catch(() => {});
  }, []);

  // Fetch profile to pre-fill footer fields
  useEffect(() => {
    axios.get(`${API_URL}/profile`).then((res) => {
      if (res.data.success) {
        const p = res.data.profile;
        if (p.companyName) setFooterName(p.companyName);
        if (p.address)     setFooterAddress(p.address);
        if (p.phone)       setFooterPhone(p.phone);
        if (p.facebook)    setFooterFacebook(p.facebook);
        if (p.instagram)   setFooterInstagram(p.instagram);
        if (p.youtube)     setFooterYoutube(p.youtube);
        if (p.website)     setFooterWebsite(p.website);
        // Pre-fill logo preview from profile logo
        if (p.logo) {
          setProfileLogoPath(p.logo);
          const filename = p.logo.replace(/\\/g, '/').split('/').pop();
          setLogoPreview(`https://server2.vais.co.in/testb/uploads/${filename}`);
        }
      }
    }).catch(() => {});
  }, []);

  // ── Excel Upload ──────────────────────────────────────────────────────────
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
      setExcelEmails(response.data.emails);
      toast.success(`Extracted ${response.data.count} email addresses from Excel`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error uploading Excel file");
    } finally {
      setLoading(false);
    }
  };

  // ── Manual Email Input ────────────────────────────────────────────────────
  const addManualEmail = () => {
    const trimmed = manualInput.trim();
    if (!trimmed) return;

    // Support comma or newline separated emails
    const parsed = trimmed.split(/[\n,]+/).map((e) => e.trim()).filter((e) => e.includes("@") && e.includes("."));
    const newEmails = parsed.filter((e) => !manualEmails.includes(e) && !excelEmails.includes(e));

    if (parsed.length === 0) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setManualEmails([...manualEmails, ...newEmails]);
    setManualInput("");

    if (newEmails.length < parsed.length) {
      toast("Some emails were already in the list.", { icon: "ℹ️" });
    }
  };

  const removeManualEmail = (email) => {
    setManualEmails(manualEmails.filter((e) => e !== email));
  };

  const removeExcelEmail = (email) => {
    setExcelEmails(excelEmails.filter((e) => e !== email));
  };

  // ── Logo Upload ────────────────────────────────────────────────────────────
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop().toLowerCase();
    if (!["jpg", "jpeg", "png", "gif"].includes(fileExt)) {
      toast.error("Please upload a valid image file");
      return;
    }

    setLogo(file);
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // ── Attachment Upload ─────────────────────────────────────────────────────
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

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject || !body || allEmails.length === 0) {
      toast.error("Please fill in all required fields and add at least one recipient");
      return;
    }

    if (!selectedAccountId) {
      toast.error("Please select a sender mail account.");
      return;
    }

    setLoading(true);

    try {
      // Upload logo if selected
      let finalLogoPath = profileLogoPath;
      if (logo) {
        const logoFormData = new FormData();
        logoFormData.append("logo", logo);
        const logoResponse = await axios.post(`${API_URL}/upload-logo`, logoFormData);
        finalLogoPath = logoResponse.data.logo.path;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("body", body);
      formData.append("footer[name]", footerName);
      formData.append("footer[address]", footerAddress);
      formData.append("footer[phone]", footerPhone);
      formData.append("footer[depertment]", footerDepertment);
      formData.append("footer[message]", footerMessage);
      formData.append("footer[facebook]", footerFacebook);
      formData.append("footer[instagram]", footerInstagram);
      formData.append("footer[youtube]", footerYoutube);
      formData.append("footer[website]", footerWebsite);
      formData.append("senderAccountId", selectedAccountId);
      if (finalLogoPath) formData.append("footer[logo]", finalLogoPath);

      allEmails.forEach((email) => formData.append("recipients[]", email));
      attachments.forEach((file) => formData.append("attachments", file));

      await axios.post(`${API_URL}/send-emails`, formData);
      toast.success("Emails sent successfully!");

      // Reset form
      setSubject("");
      setBody("");
      setFooterName("");
      setFooterAddress("");
      setFooterPhone("");
      setFooterMessage("");
      setFooterDepertment("");
      setFooterFacebook("");
      setFooterInstagram("");
      setFooterYoutube("");
      setFooterWebsite("");
      setExcelFile(null);
      setLogo(null);
      setLogoPreview("");
      setAttachments([]);
      setExcelEmails([]);
      setManualEmails([]);
      setManualInput("");
      setStep(1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending emails");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-slate-100">Create New Email Campaign</h1>

      {/* ── Step Indicator ── */}
      <div className="mb-6">
        <div className="flex items-center">
          {[1, 2, 3].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${step >= s ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-400"}`}>
                {s}
              </div>
              {i < 2 && <div className={`flex-1 h-1 mx-2 rounded transition-colors ${step > s ? "bg-blue-600" : "bg-slate-700"}`}></div>}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm text-slate-400">Add Recipients</span>
          <span className="text-sm text-slate-400">Compose Email</span>
          <span className="text-sm text-slate-400">Review & Send</span>
        </div>
      </div>

      <div className="card">
        {/* ══ STEP 1: Recipients ══ */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-slate-100">Add Recipients</h2>

            {/* Excel Upload */}
            <div className="form-group">
              <label className="block mb-2 font-medium text-slate-300">
                📊 Upload Excel File (optional)
              </label>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleExcelUpload}
                className="input-field"
              />
              <p className="mt-1 text-sm text-slate-500">
                Upload an Excel file — we'll extract all email addresses automatically
              </p>
            </div>

            {loading && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-2 text-slate-400">Processing Excel...</p>
              </div>
            )}

            {/* Excel extracted emails */}
            {excelEmails.length > 0 && (
              <div className="mt-4 mb-6">
                <h3 className="font-medium mb-2 text-slate-300">
                  📧 From Excel ({excelEmails.length})
                </h3>
                <div className="max-h-32 overflow-y-auto flex flex-wrap gap-2 border border-slate-700 rounded-lg p-3 bg-slate-800/50">
                  {excelEmails.map((email, index) => (
                    <span key={index} className="email-tag">
                      {email}
                      <button onClick={() => removeExcelEmail(email)} className="email-tag-remove">×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Manual email input */}
            <div className="form-group">
              <label className="block mb-2 font-medium text-slate-300">
                ✏️ Add Emails Manually
              </label>
              <div className="flex gap-2">
                <textarea
                  rows={3}
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="input-field"
                  placeholder="Enter emails separated by commas or new lines&#10;e.g. alice@example.com, bob@test.com"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) addManualEmail();
                  }}
                />
              </div>
              <button
                type="button"
                className="btn btn-secondary mt-2"
                onClick={addManualEmail}
              >
                ➕ Add to List
              </button>
              <p className="mt-1 text-xs text-slate-500">Tip: Press Ctrl+Enter or click "Add to List"</p>
            </div>

            {/* Manual emails tags */}
            {manualEmails.length > 0 && (
              <div className="mt-2 mb-4">
                <h3 className="font-medium mb-2 text-slate-300">
                  ✍️ Manually Added ({manualEmails.length})
                </h3>
                <div className="flex flex-wrap gap-2 border border-slate-700 rounded-lg p-3 bg-slate-800/50">
                  {manualEmails.map((email, index) => (
                    <span key={index} className="email-tag email-tag-manual">
                      {email}
                      <button onClick={() => removeManualEmail(email)} className="email-tag-remove">×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Total count */}
            {allEmails.length > 0 && (
              <div className="total-emails-badge">
                ✅ Total: <strong>{allEmails.length}</strong> unique recipients ready
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (allEmails.length === 0) {
                    toast.error("Please add at least one recipient email.");
                    return;
                  }
                  setStep(2);
                }}
              >
                Next: Compose Email →
              </button>
            </div>
          </div>
        )}

        {/* ══ STEP 2: Compose ══ */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-slate-100">Compose Email</h2>

            <div className="form-group">
              <label className="block mb-2 font-medium text-slate-300">Subject *</label>
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
              <label className="block mb-2 font-medium text-slate-300">Email Body *</label>
              <textarea
                rows={7}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="input-field"
                placeholder="Write your email content here..."
                required
              />
            </div>

            <div className="form-group">
              <label className="block mb-2 font-medium text-slate-300">Attachments</label>
              <input
                type="file"
                multiple
                onChange={handleAttachmentUpload}
                className="input-field"
              />
              <p className="mt-1 text-sm text-slate-500">Up to 5 attachments (deleted from server after send)</p>
            </div>

            {attachments.length > 0 && (
              <div className="mt-2 mb-4">
                <h3 className="font-medium mb-2 text-slate-300">Attachments ({attachments.length})</h3>
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border border-slate-700 rounded-md bg-slate-800">
                      <span className="truncate text-slate-300 text-sm">📎 {file.name}</span>
                      <button type="button" onClick={() => removeAttachment(index)} className="text-red-400 hover:text-red-300 ml-2">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer info */}
            <div className="mt-6 border-t border-slate-700 pt-6">
              <h3 className="font-medium mb-4 text-slate-200">✍️ Signature / Footer</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block mb-2 text-slate-300">Name / Company</label>
                  <input type="text" value={footerName} onChange={(e) => setFooterName(e.target.value)} className="input-field" placeholder="VAIS Engineering Pvt Ltd" />
                </div>
                <div className="form-group">
                  <label className="block mb-2 text-slate-300">Department / Designation</label>
                  <input type="text" value={footerDepertment} onChange={(e) => setFooterDepertment(e.target.value)} className="input-field" placeholder="HR Department" />
                </div>
                <div className="form-group">
                  <label className="block mb-2 text-slate-300">Phone Number</label>
                  <input type="text" value={footerPhone} onChange={(e) => setFooterPhone(e.target.value)} className="input-field" placeholder="+91 9999999999" />
                </div>
                <div className="form-group">
                  <label className="block mb-2 text-slate-300">Sign-off Message</label>
                  <input type="text" value={footerMessage} onChange={(e) => setFooterMessage(e.target.value)} className="input-field" placeholder="With Best Regards," />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="form-group">
                  <label className="block mb-2 text-slate-300">Facebook URL</label>
                  <input type="url" value={footerFacebook} onChange={(e) => setFooterFacebook(e.target.value)} className="input-field" placeholder="https://facebook.com/..." />
                </div>
                <div className="form-group">
                  <label className="block mb-2 text-slate-300">Instagram URL</label>
                  <input type="url" value={footerInstagram} onChange={(e) => setFooterInstagram(e.target.value)} className="input-field" placeholder="https://instagram.com/..." />
                </div>
                <div className="form-group">
                  <label className="block mb-2 text-slate-300">YouTube URL</label>
                  <input type="url" value={footerYoutube} onChange={(e) => setFooterYoutube(e.target.value)} className="input-field" placeholder="https://youtube.com/..." />
                </div>
                <div className="form-group">
                  <label className="block mb-2 text-slate-300">Website URL</label>
                  <input type="url" value={footerWebsite} onChange={(e) => setFooterWebsite(e.target.value)} className="input-field" placeholder="https://..." />
                </div>
              </div>
              <div className="form-group mt-4">
                <label className="block mb-2 text-slate-300">Address</label>
                <textarea rows={2} value={footerAddress} onChange={(e) => setFooterAddress(e.target.value)} className="input-field" placeholder="123 Business St, City, State" />
              </div>
              <div className="form-group">
                <label className="block mb-2 text-slate-300">Logo (optional)</label>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="input-field" />
              </div>
              {logoPreview && (
                <div className="mt-2">
                  <p className="text-sm text-slate-400 mb-2">Logo Preview:</p>
                  <img src={logoPreview} alt="Logo" className="max-w-xs max-h-24 border border-slate-700 p-1 rounded-md" />
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>Next: Review & Send →</button>
            </div>
          </div>
        )}

        {/* ══ STEP 3: Review & Send ══ */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-slate-100">Review & Send</h2>

            <div className="space-y-4">
              {/* Recipients summary */}
              <div className="review-card">
                <h3 className="font-medium mb-2 text-slate-200">👥 Recipients ({allEmails.length})</h3>
                <div className="flex flex-wrap gap-1 mt-2 max-h-24 overflow-y-auto">
                  {allEmails.slice(0, 20).map((email, index) => (
                    <span key={index} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">{email}</span>
                  ))}
                  {allEmails.length > 20 && (
                    <span className="text-xs text-slate-500">+{allEmails.length - 20} more</span>
                  )}
                </div>
              </div>

              {/* Content summary */}
              <div className="review-card">
                <h3 className="font-medium mb-2 text-slate-200">📝 Email Content</h3>
                <p className="text-sm"><span className="text-slate-400">Subject:</span> <span className="text-slate-200">{subject}</span></p>
                <div className="mt-2 p-3 bg-slate-900 rounded border border-slate-700 text-sm text-slate-300 whitespace-pre-wrap max-h-32 overflow-y-auto">
                  {body}
                </div>
              </div>

              {/* Footer summary */}
              {(footerName || footerAddress || footerFacebook || footerInstagram || footerYoutube || footerWebsite) && (
                <div className="review-card">
                  <h3 className="font-medium mb-2 text-slate-200">✍️ Signature</h3>
                  <div className="text-sm space-y-1 text-slate-300">
                    {footerName && <p><span className="text-slate-400">Name:</span> {footerName}</p>}
                    {footerDepertment && <p><span className="text-slate-400">Department:</span> {footerDepertment}</p>}
                    {footerPhone && <p><span className="text-slate-400">Phone:</span> {footerPhone}</p>}
                    {footerAddress && <p><span className="text-slate-400">Address:</span> {footerAddress}</p>}
                    {(footerFacebook || footerInstagram || footerYoutube || footerWebsite) && (
                      <div className="flex gap-2 mt-2">
                        {footerFacebook && <a href={footerFacebook} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Facebook</a>}
                        {footerInstagram && <a href={footerInstagram} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">Instagram</a>}
                        {footerYoutube && <a href={footerYoutube} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">YouTube</a>}
                        {footerWebsite && <a href={footerWebsite} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">Website</a>}
                      </div>
                    )}
                    {logoPreview && <img src={logoPreview} alt="Logo" className="mt-2 max-h-16" />}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {attachments.length > 0 && (
                <div className="review-card">
                  <h3 className="font-medium mb-2 text-slate-200">📎 Attachments ({attachments.length})</h3>
                  <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                    {attachments.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ⭐ SENDER SELECTION ⭐ */}
              <div className="sender-select-card">
                <h3 className="font-semibold mb-3 text-slate-100">📤 Select Sender Account</h3>
                {mailAccounts.length === 0 ? (
                  <div className="text-slate-400 text-sm">
                    ⚠️ No mail accounts configured.{' '}
                    <a href="/profile" className="text-blue-400 hover:text-blue-300 underline">Go to Profile</a>{' '}
                    to add one first.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {mailAccounts.map((account) => (
                      <label
                        key={account._id}
                        className={`sender-option ${selectedAccountId === account._id ? 'selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="senderAccount"
                          value={account._id}
                          checked={selectedAccountId === account._id}
                          onChange={() => setSelectedAccountId(account._id)}
                          className="sr-only"
                        />
                        <div className="sender-option-domain">{account.domain.toUpperCase()}</div>
                        <div>
                          <p className="font-medium text-slate-200">{account.label}</p>
                          <p className="text-slate-400 text-sm">{account.email}</p>
                        </div>
                        {selectedAccountId === account._id && (
                          <div className="ml-auto text-blue-400 text-lg">✓</div>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading || !selectedAccountId || mailAccounts.length === 0}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    Sending...
                  </span>
                ) : `🚀 Send to ${allEmails.length} Recipients`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailSender;
