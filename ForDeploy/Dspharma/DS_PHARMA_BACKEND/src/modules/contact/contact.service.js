import Contact from "./contact.model.js";

export const createContactService = async ({
  name,
  contactDetails,
  subject,
  message,
}) => {
  const contact = await Contact.create({
    name,
    contactDetails,
    subject,
    message,
  });
  return contact;
};

export const getContactsService = async ({
  page = 1,
  limit = 10,
  search = "",
}) => {
  const currentPage = parseInt(page, 10);
  const perPage = parseInt(limit, 10);

  const filter = {};
  if (search) {
    const s = search.trim();
    filter.$or = [
      { name: { $regex: s, $options: "i" } },
      { contactDetails: { $regex: s, $options: "i" } },
      { subject: { $regex: s, $options: "i" } },
      { message: { $regex: s, $options: "i" } },
    ];
  }

  const total = await Contact.countDocuments(filter);
  const contacts = await Contact.find(filter)
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * perPage)
    .limit(perPage);

  return {
    contacts,
    pagination: {
      totalItems: total,
      totalPages: Math.ceil(total / perPage),
      currentPage,
      limit: perPage,
    },
  };
};

export const getContactByIdService = async (id) => {
  const contact = await Contact.findById(id);
  if (!contact) {
    const error = new Error("Contact not found");
    error.statusCode = 404;
    throw error;
  }
  return contact;
};

export const deleteContactService = async (id) => {
  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) {
    const error = new Error("Contact not found");
    error.statusCode = 404;
    throw error;
  }
  return contact;
};
