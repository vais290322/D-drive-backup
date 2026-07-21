import HeadmasterSignaturePhoto from "../models/HeadmasterSignaturePhoto.model.js";
import { deleteFromVaisBucket } from "../utils/deleteFromVaisBucket.js";
import { uploadToVaisBucket } from "../utils/uploadToVaisBucket.js";


const createHeadmasterSignaturePhoto = async (req, res) => {
  try {
    const { schoolId } = req.body;
    // console.log("file and id : ", req.file, req.body);
    if (!schoolId) {
      return res.status(400).json({ error: "School ID is required" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }
 

    const exitHeadmasterSignaturePhoto = await HeadmasterSignaturePhoto.findOne({ schoolId });
    if (exitHeadmasterSignaturePhoto) {
      return res.status(400).json({ success: false, data: exitHeadmasterSignaturePhoto, message: "Headmaster signature photo already exists" });
    }
   
    const folderId = process.env.BUCKET_FOLDERID;
    const fileUrl = await uploadToVaisBucket(req.file, folderId);
    // console.log("bucket response : ",fileUrl)

    const headmasterSignaturePhoto = await HeadmasterSignaturePhoto.create({
      schoolId,
      photo: {
        fileUrl:fileUrl.fileUrl,
        fileId:fileUrl.fileId,
      },
    });
    return res.status(201).json({ success: true, data: headmasterSignaturePhoto, message: "Headmaster signature photo uploaded successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateHeadmasterSignaturePhoto = async (req, res) => {
  try {
    const { schoolId } = req.body;
    
    if (!schoolId) {
      return res.status(400).json({ error: "School ID is required" });
    }
  
    const exitingHeadmasterSignaturePhoto = await HeadmasterSignaturePhoto.findOne({ schoolId });

    if (!exitingHeadmasterSignaturePhoto) {
      return res.status(404).json({ success: false, message: "Headmaster signature photo not found" });
    }

    const fileId= exitingHeadmasterSignaturePhoto.photo.fileId;
    const deleteResponse = await deleteFromVaisBucket(fileId);

    // console.log("deleteResponse : ", deleteResponse);
    if (deleteResponse.success) {
      const folderId = process.env.BUCKET_FOLDERID;
      const fileUrl = await uploadToVaisBucket(req.file, folderId);
    //   console.log("bucket response : ", fileUrl);

      const headmasterSignaturePhoto = await HeadmasterSignaturePhoto.findOneAndUpdate(
        { schoolId },
        { photo: { fileUrl: fileUrl.fileUrl, fileId: fileUrl.fileId } },
        { new: true });
          
         return res.status(201).json({ success: true, data: headmasterSignaturePhoto, message: "Headmaster signature photo updated successfully" });
    }
    
   



  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const deleteHeadmasterSignaturePhoto = async (req, res) => {
  try {
    const { schoolId } = req.body;
    if (!schoolId) {
      return res.status(400).json({ error: "School ID is required" });
    }
    const exitingHeadmasterSignaturePhoto = await HeadmasterSignaturePhoto.findOne({ schoolId });
    if (!exitingHeadmasterSignaturePhoto) {
      return res.status(404).json({ success: false, message: "Headmaster signature photo not found" });
    }
    const fileId= exitingHeadmasterSignaturePhoto.photo.fileId;
    const deleteResponse = await deleteFromVaisBucket(fileId);
    if (deleteResponse.success) {
      await HeadmasterSignaturePhoto.findOneAndDelete({ schoolId });
      return res.status(201).json({ success: true, message: "Headmaster signature photo deleted successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getHeadmasterSignaturePhoto = async (req, res) => {
  try {
    const { schoolId } = req.params;
    if (!schoolId) {
      return res.status(400).json({ error: "School ID is required" });
    }
    const headmasterSignaturePhoto = await HeadmasterSignaturePhoto.findOne({ schoolId });
    if (!headmasterSignaturePhoto) {
      return res.status(404).json({ success: false, message: "Headmaster signature photo not found" });
    }
    return res.status(201).json({ success: true, data: headmasterSignaturePhoto, message: "Headmaster signature photo fetched successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { createHeadmasterSignaturePhoto, updateHeadmasterSignaturePhoto, deleteHeadmasterSignaturePhoto, getHeadmasterSignaturePhoto };
