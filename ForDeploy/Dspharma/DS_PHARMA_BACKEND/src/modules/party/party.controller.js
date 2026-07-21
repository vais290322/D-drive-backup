import ApiResponse from '../../utils/apiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import {
  fetchPartiesService,
  getPartiesService,
  getPartyDetailsService,
  partyRegisterService,
  partyLoginService,
  updatePartyService,
  getPartyByUserIdService,
} from './party.service.js';
import { sendPartyRegistrationEmail } from '../../emails/signupEmailSender.js';

export const getParties = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query = '' } = req.query;
  const { parties, totalPages, totalParties } = await getPartiesService(
    page,
    limit,
    query.trim().toLowerCase(),
  );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        parties,
        totalParties,
        page: Number(page),
        limit: Number(limit),
        totalPages: Number(totalPages),
        currentPage: Number(page),
        hasMore: Number(page) < Number(totalPages),
      },
      'Parties fetched successfully',
    ),
  );
});

export const fetchParties = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query = '',
    sortBy = 'name',
    is_deleted = '0',
    order = 1,
  } = req.query;

  const {
    parties,
    totalPages,
    totalParties,
    totalActiveParties,
    totalDeletedParties,
    totalBalance,
    totalPDC,
  } = await fetchPartiesService(
    Number(page),
    Number(limit),
    query.trim().toLowerCase(),
    sortBy,
    is_deleted,
    Number(order),
  );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        parties,
        totalParties,
        totalActiveParties,
        totalDeletedParties,
        totalBalance,
        totalPDC,
        page: Number(page),
        limit: Number(limit),
        totalPages: Number(totalPages),
        currentPage: Number(page),
        hasMore: Number(page) < Number(totalPages),
      },
      'Parties fetched successfully',
    ),
  );
});

export const getPartyDetails = asyncHandler(async (req, res) => {
  const { rid } = req.params;

  const party = await getPartyDetailsService(rid);

  res
    .status(200)
    .json(new ApiResponse(200, party, 'Party details fetched successfully'));
});

export const partyRegisterController1 = asyncHandler(async (req, res) => {
  const { name, phone1, email1, address, MargCode, GSTIN, DlNo, password } =
    req.body;

  const party = await partyRegisterService({
    name,
    phone1,
    email1,
    address,
    MargCode,
    GSTIN,
    DlNo,
    password,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, party, 'Party registered successfully'));
});

export const partyRegisterController = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      establishmentName,
      incorporationDate,
      tradeLicenseNumber,
      drugLicenseNumber,
      panLicenseNumber,
      gstLicenseNumber,
      margId,
      addressLine1,
      addressLine2,
      city,
      postOffice,
      policeStation,
      pinNumber,
      district,
      country,
      contactPersonName,
      contactPersonPhone,
    } = req.body;

    // Send registration email to admin with all submitted data
    await sendPartyRegistrationEmail({
      name,
      email,
      phone,
      password,
      establishmentName,
      incorporationDate,
      tradeLicenseNumber,
      drugLicenseNumber,
      panLicenseNumber,
      gstLicenseNumber,
      margId,
      addressLine1,
      addressLine2,
      city,
      postOffice,
      policeStation,
      pinNumber,
      district,
      country,
      contactPersonName,
      contactPersonPhone,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          name,
          email,
          phone,
          establishmentName,
          city,
          district,
        },
        'Thank you for registering! We have received your details and will get back to you shortly.',
      ),
    );
  } catch (error) {
    console.error('Party registration error:', error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          'Something went wrong while processing your registration. Please try again.',
        ),
      );
  }
});

export const partyLoginController = asyncHandler(async (req, res) => {
  const { userId, password } = req.body;

  const { party, token } = await partyLoginService({ userId, password });

  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { party, token }, 'Party logged in successfully'),
    );
});

export const updatePartyController = asyncHandler(async (req, res) => {
  const party = await updatePartyService(req?.party?._id, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, party, 'Party profile updated successfully'));
});

export const logoutPartyController = asyncHandler(async (req, res) => {
  res.clearCookie('token');

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Logged out successfully'));
});

export const getPartyByUserId = async (req, res) => {
  const { userId } = req.user;
  const party = await getPartyByUserIdService(userId);
  return res
    .status(200)
    .json({ message: ' User fetched successfully', data: party });
};
