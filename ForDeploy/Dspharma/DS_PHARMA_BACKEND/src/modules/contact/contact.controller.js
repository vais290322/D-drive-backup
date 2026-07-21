import {
  createContactService,
  getContactsService,
  getContactByIdService,
  deleteContactService,
} from "./contact.service.js";

export const createContact = async (req, res) => {
  try {
    const { name, subject, message, contactDetails } = req.body;
    if (!name || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, subject and message are required",
      });
    }
    const contact = await createContactService({
      name,
      contactDetails,
      subject,
      message,
    });
    return res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: contact,
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const result = await getContactsService(req.query);
    return res.status(200).json({
      success: true,
      message: "Contacts fetched successfully",
      ...result,
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

export const getContactById = async (req, res) => {
  try {
    const contact = await getContactByIdService(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Contact fetched successfully",
      data: contact,
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    await deleteContactService(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};
