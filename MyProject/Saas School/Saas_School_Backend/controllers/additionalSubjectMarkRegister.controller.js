import Marks from "../models/AdditionalSubjectMarkRegister.model.js";


const createAdditionalSubjectMarkRegister = async (req, res) => {
    try {
        const { schoolId, className, section, subject, examType, fullMarks, subjectFullMark, projectFullMark, teacherName, userRole, marks } = req.body;

        if (!schoolId || !className || !section || !subject || !examType || !fullMarks || !subjectFullMark || !marks) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingMarks = await Marks.findOne({
            schoolId,
            className,
            section,
            subject,
            examType
        });

        if (existingMarks) {
            return res.status(400).json({ success: false, message: "Additional subject mark register already exists" });
        }

        const marksData = new Marks({
            schoolId,
            className,
            section,
            subject,
            examType,
            fullMarks,
            subjectFullMark,
            projectFullMark,
            teacherName,
            userRole,
            marks
        });
        await marksData.save();
        res.status(201).json({ success: true, message: "Additional subject mark register created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Failed to create additional subject mark register" });
    }
}

const updateAdditionalSubjectMarkRegister = async (req, res) => {
    try {
        const { schoolId, className, section, subject, examType, fullMarks, subjectFullMark, projectFullMark, teacherName, userRole, marks } = req.body;
        const marksData = await Marks.findOneAndUpdate(
            {
                schoolId,
                className,
                section,
                subject,
                examType
            },
            {
                fullMarks,
                subjectFullMark,
                projectFullMark,
                teacherName,
                userRole,
                marks
            },
            { new: true }
        );
        res.status(200).json({ success: true, message: "Additional subject mark register updated successfully", data: marksData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Failed to update additional subject mark register" });
    }
}

const deleteAdditionalSubjectMarkRegister = async (req, res) => {
    try {
        const { schoolId, className, section, subject, examType } = req.query;
        const marksData = await Marks.findOneAndDelete({
            schoolId,
            className,
            section,
            subject,
            examType
        });
        res.status(200).json({ success: true, message: "Additional subject mark register deleted successfully", data: marksData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Failed to delete additional subject mark register" });
    }
}

const additionalMarksheetData = async (req, res) => {
  try {
    const { schoolId, className, section, examType } = req.query;

    const marksData = await Marks.aggregate([
      {
        $match: {
          schoolId,
          className,
          section,
          examType
        }
      },
      {
        $unwind: "$marks"
      },
      {
        $project: {
          name: "$marks.name",
          roll: "$marks.roll",

          subject: "$subject",
          writtenMarks: "$marks.mark",
          projectMarks: "$marks.projectMark",

          totalMarks: {
            $add: ["$marks.mark", "$marks.projectMark"]
          },

          subjectFullMark: "$subjectFullMark",
          projectFullMark: "$projectFullMark"
        }
      },
      {
        $group: {
          _id: "$roll",
          name: { $first: "$name" },
          roll: { $first: "$roll" },
          subjects: {
            $push: {
              subject: "$subject",
              writtenMarks: "$writtenMarks",
              projectMarks: "$projectMarks",
              totalMarks: "$totalMarks",
              subjectFullMark: "$subjectFullMark",
              projectFullMark: "$projectFullMark"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          name: 1,
          roll: 1,
          subjects: 1
        }
      },
      {
        $sort: { roll: -1 }
      }
    ]);

    // console.log("marksData", marksData,examType,className,section,schoolId);

    return res.status(200).json({
      success: true,
      message: "Additional subject mark register fetched successfully",
      data: {
        examType,
        section,
        class: className,
        schoolId,
        markSheets: marksData
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get additional subject mark register"
    });
  }
};



export {
    createAdditionalSubjectMarkRegister,
    updateAdditionalSubjectMarkRegister,
    deleteAdditionalSubjectMarkRegister,
    additionalMarksheetData
}