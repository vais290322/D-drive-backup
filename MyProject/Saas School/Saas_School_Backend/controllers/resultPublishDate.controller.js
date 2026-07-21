import ResultPublishDate from "../models/ResultPublishDate.model.js";


const createResultPublishDate = async (req, res) => {
    try {
        const {schoolId} = req.params;
        const { className, examType, resultPublishDate } = req.body;
        const missingFields = [];

        if (!className) missingFields.push("className");
        if (!examType) missingFields.push("examType");
        if (!resultPublishDate) missingFields.push("resultPublishDate");
        if (!schoolId) missingFields.push("schoolId");

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required field(s): ${missingFields.join(", ")}`,
                data: missingFields,
                success: false,
                error: true,
            });
        }

        const existingResultPublishDate = await ResultPublishDate.findOne({
            className,
            examType,
            schoolId,
        });

        if (existingResultPublishDate) {
            return res.status(400).json({
                message: "Result Publish Date already exists",
                success: false,
                error: true,
            });
        }

        const resultPublishDateData = new ResultPublishDate({
            className,
            examType,
            resultPublishDate,
            schoolId,
        });
        await resultPublishDateData.save();
        res.status(201).json({ message: "Result Publish Date created successfully", success: true, error: false,data: resultPublishDateData });
    } catch (error) {
        res.status(500).json({ message: error?.message || error?.respnse?.message || "Something went wrong", success: false, error: true });
    }
};

const updateResultPublishDate = async (req, res) => {
    try {
        const {schoolId,id} = req.params;
        const { className, examType, resultPublishDate } = req.body;
        const missingFields = [];

        if (!className) missingFields.push("className");
        if (!examType) missingFields.push("examType");
        if (!resultPublishDate) missingFields.push("resultPublishDate");
        if (!schoolId) missingFields.push("schoolId");

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required field(s): ${missingFields.join(", ")}`,
                data: missingFields,
                success: false,
                error: true,
            });
        }

        const exitingResultPublishDate = await ResultPublishDate.findById(id);
        if (!exitingResultPublishDate) {
            return res.status(404).json({
                message: "Result Publish Date not found",
                success: false,
                error: true,
            });
        }


        exitingResultPublishDate.className = className;
        exitingResultPublishDate.examType = examType;
        exitingResultPublishDate.resultPublishDate = resultPublishDate;

        await exitingResultPublishDate.save();

        res.status(201).json({ message: "Result Publish Date updated successfully", success: true, error: false,data: exitingResultPublishDate });
    } catch (error) {
        res.status(500).json({ message: error?.message || error?.respnse?.message || "Something went wrong", success: false, error: true });
    }
};

const deleteResultPublishDate = async (req, res) => {
    try {
        const {schoolId,id} = req.params;
        const missingFields = [];

        if (!schoolId) missingFields.push("schoolId");
        if (!id) missingFields.push("id");

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required field(s): ${missingFields.join(", ")}`,
                data: missingFields,
                success: false,
                error: true,
            });
        }

        const exitingResultPublishDate = await ResultPublishDate.findById(id);
        if (!exitingResultPublishDate) {
            return res.status(404).json({
                message: "Result Publish Date not found",
                success: false,
                error: true,
            });
        }

        await exitingResultPublishDate.deleteOne();

        res.status(201).json({ message: "Result Publish Date deleted successfully", success: true, error: false,data: exitingResultPublishDate });
    } catch (error) {
        res.status(500).json({ message: error?.message || error?.respnse?.message || "Something went wrong", success: false, error: true });
    }
};

const getAllResultPublishDate = async (req, res) => {
    try {
        const {schoolId} = req.params;
        const missingFields = [];

        if (!schoolId) missingFields.push("schoolId");

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required field(s): ${missingFields.join(", ")}`,
                data: missingFields,
                success: false,
                error: true,
            });
        }

        const exitingResultPublishDate = await ResultPublishDate.find({schoolId});
        if (!exitingResultPublishDate) {
            return res.status(404).json({
                message: "Result Publish Date not found",
                success: false,
                error: true,
            });
        }

        res.status(201).json({ message: "Result Publish Date fetched successfully", success: true, error: false,data: exitingResultPublishDate });
    } catch (error) {
        res.status(500).json({ message: error?.message || error?.respnse?.message || "Something went wrong", success: false, error: true });
    }
};

const searchResultPublishDate = async (req, res) => {
    try {
        const {schoolId} = req.params;
        const {className,examType} = req.query;
        const missingFields = [];

        if (!schoolId) missingFields.push("schoolId");
        if (!className) missingFields.push("className");
        if (!examType) missingFields.push("examType");

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required field(s): ${missingFields.join(", ")}`,
                data: missingFields,
                success: false,
                error: true,
            });
        }

        const exitingResultPublishDate = await ResultPublishDate.find({schoolId, $and: [{className: {$regex: className, $options: "i"}},{examType: {$regex: examType, $options: "i"}}] });
        if (!exitingResultPublishDate) {
            return res.status(404).json({
                message: "Result Publish Date not found",
                success: false,
                error: true,
            });
        }

        res.status(201).json({ message: "Result Publish Date fetched successfully", success: true, error: false,data: exitingResultPublishDate });
    } catch (error) {
        res.status(500).json({ message: error?.message || error?.respnse?.message || "Something went wrong", success: false, error: true });
    }
};


export {
    createResultPublishDate,
    updateResultPublishDate,
    deleteResultPublishDate,
    getAllResultPublishDate,
    searchResultPublishDate
}