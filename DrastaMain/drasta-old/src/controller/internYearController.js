const InternYear = require('../model/InternYear');

exports.addInternToYear = async (req, res) => {
  try {
    const { year, name, details } = req.body;
    const image = req.file?.path;

    let yearDoc = await InternYear.findOne({ year });
    if (!yearDoc) {
      yearDoc = await InternYear.create({ year, interns: [{ name, details, image }] });
    } else {
      yearDoc.interns.push({ name, details, image });
      await yearDoc.save();
    }
    res.status(201).json({ yearDoc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInternYears = async (req, res) => {
  try {
    const years = await InternYear.find().sort({ year: -1 });
    res.json({ years });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.deleteInternFromYear = async (req, res) => {
  try {
    const { year, internId } = req.params;

    const updatedYear = await InternYear.findOneAndUpdate(
      { year },
      { $pull: { interns: { _id: internId } } },
      { new: true }
    );

    if (!updatedYear) {
      return res.status(404).json({ message: 'Intern year or intern not found' });
    }

    res.json({ message: 'Intern deleted successfully', data: updatedYear });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
