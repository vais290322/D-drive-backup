const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const authRoutes = require('./routes');
const cors = require('cors');
dotenv.config({ quiet: true });
const advisorRoutes = require('./routes/advisorRoutes');
const internYearRoutes = require('./routes/internYearRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const greenLabelRoutes = require('./routes/greenLabelRoutes');
const womenStudyRoutes = require('./routes/womenStudyRoutes');
const expertRoutes = require('./routes/expertRoutes');
const newsRoutes = require('./routes/newsRoutes');
const overviewRoutes = require('./routes/overviewRoutes');
const trusteeRoutes = require('./routes/trusteeRoutes');
const HeroSlide = require('./routes/heroSlideRoutes');   
const superAdvisorRoutes = require("./routes/superAdvisorRoute");
const missionHistoryRoutes = require("./routes/missionHistoryRoute");
const aboutGalleryRoutes = require("./routes/aboutGalleryRoute");
const administrationRoute = require("./routes/administrationRoute");
const visitorAndInternRoute = require("./routes/visitorAndInternRoute");
const researchThemeRoute = require("./routes/researchThemeRoute");
const traningThemeRoute = require("./routes/traningThemeRoute");
const researchProjectRoute = require("./routes/researchProjectRoute");
const abstractsAndResearchOnGoingProjectRoute = require('./routes/abstractsAndResearchOnGoingProjectRoute');
const directorDeskRoutes = require('./routes/directorDeskRoute');
const csrBlogRoutes = require('./routes/csrBlogRoute');
const csrContendRoutes = require('./routes/csrContentRoute');
const dataNewsRoutes = require('./routes/dataNewsRoute');
const contactUsRoute = require('./routes/contactUsRoute');


const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
const multer = require('multer');
app.use((err, req, res, next) => {
  console.error('🌐 GLOBAL ERROR:', err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  res.status(err.status || 500).json({ error: err.message || 'Unexpected Error' });
});

app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  // Don't send stack trace in production
  const isDev = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(isDev && { stack: err.stack })
  });
});


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error', err));


app.get("/",(req,res)=>{
  res.status(200).json({message:"DRASA Old Backend API IS RUNNING! Enjoy the Journey 😁😊😃"})
})

app.use('/api/v1', authRoutes);
app.use('/api/v1', advisorRoutes);
app.use('/api/v1', internYearRoutes);
app.use('/api/v1', enquiryRoutes);
app.use('/api/v1', greenLabelRoutes);
app.use('/api/v1', womenStudyRoutes);
app.use('/api/v1', expertRoutes);
app.use('/api/v1', newsRoutes);
app.use('/api/v1', overviewRoutes);
app.use('/api/v1', trusteeRoutes);
app.use('/api/v1', HeroSlide);
app.use("/api/v1/superadvisors", superAdvisorRoutes);
app.use("/api/v1/mission-history", missionHistoryRoutes);
app.use("/api/v1/about-gallery", aboutGalleryRoutes);
app.use("/api/v1/administration", administrationRoute);
app.use("/api/v1/visitor-intern", visitorAndInternRoute);
app.use("/api/v1/research-theme", researchThemeRoute);
app.use("/api/v1/traning-theme", traningThemeRoute);
app.use("/api/v1/research-project", researchProjectRoute);
app.use("/api/v1/abstracts-research", abstractsAndResearchOnGoingProjectRoute);
app.use('/api/v1/directors-desk', directorDeskRoutes);
app.use('/api/v1/csr-blog', csrBlogRoutes);
app.use('/api/v1/csr-content', csrContendRoutes);
app.use('/api/v1/data-news', dataNewsRoutes);
app.use('/api/v1/contact-us', contactUsRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
