import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useTheme } from "@/context/ThemeContext";
import { useSelector } from "react-redux";

import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    PDFViewer,
    Image,
    pdf,
    Link
} from "@react-pdf/renderer";
import { Download } from "lucide-react";

const styles = StyleSheet.create({
    page: {
        backgroundColor: "#fff",
        padding: 16,
        fontSize: 10,
        fontFamily: "Helvetica",
    },
    header: {
        border: "1pt solid #222",
        padding: 8,
        marginBottom: 8,
    },
    schoolName: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 2,
    },
    schoolDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 2,
    },
    reportTitle: {
        fontSize: 14,
        fontWeight: "medium",
        textAlign: "center",
        paddingTop: 4,
        paddingBottom: 2,
    },
    reportsubTitle: {
        fontSize: 10,
        fontWeight: "normal",
        textAlign: "center",
        marginBottom: 4,
    },

    sectionTitle: {
        backgroundColor: "#ffbb00ff",
        fontWeight: "Normal",
        paddingTop: 4,
        paddingBottom: 4,
        // marginTop: 4,
        // marginBottom: 2,
        fontSize: 12,
        borderTop: "1pt solid #222",
        borderBottom: "1pt solid #222",
        textAlign: "center",
    },
    sectionAcademicTitle: {
        fontWeight: "Normal",
        paddingTop: 4,
        paddingBottom: 4,
        // marginTop: 4,
        // marginBottom: 2,
        fontSize: 12,
        textAlign: "center",
    },
    detailsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 2,
    },
    detailsCol: {
        width: "48%",
        padding: 4,
    },
    table: {
        // border: "1pt solid #222",
        borderRight: "1pt solid #222",
        borderLeft: "1pt solid #222",
        borderTop: "1pt solid #222",
        marginTop: 6,
        marginBottom: 6,
    },
    tableHeader: {
        flexDirection: "row",
        // backgroundColor: "#8fd18f",
        borderBottom: "1pt solid #222",
        borderTop: "1pt solid #222",
    },
    tableCellHeader: {
        flex: 1,
        fontWeight: "normal",
        padding: 2,
        borderRight: "1pt solid #222",
        textAlign: "center",
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: "1pt solid #222",
    },
    tableCell: {
        flex: 1,
        padding: 2,
        fontSize: 8,
        borderRight: "1pt solid #222",
        textAlign: "center",
    },
    tableCellLast: {
        flex: 1,
        padding: 2,
        textAlign: "center",
    },
    coScholasticHeader: {
        backgroundColor: "#b6d6f6",
        fontWeight: "medium",
        padding: 2,
        fontSize: 10,
        textAlign: "center",
        borderBottom: "1pt solid #222",
    },
    coScholasticRow: {
        flexDirection: "row",
        borderBottom: "1pt solid #222",
    },
    coScholasticCell: {
        flex: 2,
        padding: 2,
        borderRight: "1pt solid #222",
    },
    coScholasticCellGrade: {
        flex: 1,
        padding: 2,
        textAlign: "center",
    },
    remarks: {
        marginTop: 8,
        marginBottom: 4,
    },
    signatureRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
        fontSize: 10,
    },

    gradingTable: {
        marginTop: 20,
        border: "1pt solid #222",
    },
    gradingHeader: {
        backgroundColor: "#8c6bc5",
        padding: 6,
        color: "white",
        textAlign: "center",
        fontSize: 12,
        borderBottom: "1pt solid #222",
    },
    gradingRow: {
        flexDirection: "row",
        borderBottom: "1pt solid #222",
    },
    gradingCell: {
        flex: 1,
        padding: 4,
        fontSize: 9,
        borderRight: "1pt solid #222",
        textAlign: "center",
    },
    notesSection: {
        marginTop: 20,
        fontSize: 9,
    },
    noteItem: {
        flexDirection: "row",
        marginBottom: 4,
    },
    capitalize: {
        textTransform: "capitalize",
    },
});

const PdfDocument = ({ institute, marksheetData, gradeSystem, totalExamMarks,signaturePreview }) => (

    // console.log("mark sheet data : ", signaturePreview),
  

    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    {/* Left Section: Affiliation No + Logo */}
                    <View style={{ alignItems: "center", width: 90 }}>

                        <Image
                            src={institute?.schoolLogo}
                            style={{ width: 70, height: 70 }}
                        />
                    </View>


                    {/* Center Section: School Name and Details */}
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={styles.schoolName}>{institute.schoolName}</Text>
                        <Text
                            style={{
                                fontSize: 9,
                                textAlign: "center",
                                marginBottom: 2,
                                fontStyle: "italic",
                                width: "50%"
                            }}
                        >
                            {institute.schoolAddress}
                        </Text>
                        <Text style={{ fontSize: 9, textAlign: "center" }}>
                            {institute.schoolEmail}
                        </Text>
                        <Text style={{ fontSize: 9, textAlign: "center" }}>
                            Contact No : {institute.schoolPhone}
                        </Text>

                        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 4 }}>
                            <Text style={{ fontSize: 9 }}>School Website: </Text>
                            <Link
                                src={
                                    institute?.schoolWebsite?.startsWith("http")
                                        ? institute.schoolWebsite
                                        : `https://${institute?.schoolWebsite || " "}`
                                }
                                style={{ fontSize: 9, color: "#e74c3c", textDecoration: "underline" }}

                            >
                                {institute?.schoolWebsite || " "}
                            </Link>
                        </View>



                    </View>


                    {/* Right Section: School Code + Logo */}
                    <View style={{ alignItems: "center", width: 100 }}>
                          <Text style={{ fontSize: 8, marginBottom: 2 }}>
                            Registration No : {institute?.schoolRegistrationNumber}
                        </Text>
                        <Text style={{ fontSize: 8, marginBottom: 2 }}>
                            School Code : {institute.schoolCode}
                        </Text>
                        {/* <Image
                            src={institute?.schoolLogo}
                            style={{ width: 40, height: 40 }}
                        /> */}
                    </View>
                </View>
            </View>

            {/* Report Card Title */}
            <View
                style={{
                    height: "auto",
                    backgroundColor: "#fff",
                    marginBottom: 4,
                    border: "1pt solid #222",
                    borderRadius: 4,
                }}
            >
                <Text style={styles.reportTitle}>Report Card ({marksheetData?.examType})</Text>
                <Text style={styles.reportsubTitle}>
                    Class : {marksheetData?.studentDetails?.className}     Section : {marksheetData?.studentDetails?.section}        Session : {marksheetData?.studentDetails?.academicYear}
                </Text>

                {/* Student Details */}
                <Text style={styles.sectionTitle}>Student Details</Text>
                <View style={styles.detailsRow}>
                    <View style={styles.detailsCol}>
                        <Text style={{ paddingBottom: "4px" }}>Admission No : {marksheetData?.studentDetails?.admissionNumber}</Text>
                        <Text style={{ paddingBottom: "4px", textTransform: "capitalize" }}>
                            Student Name : {marksheetData?.studentDetails.studentName}
                        </Text>
                        <Text style={{ paddingBottom: "4px", textTransform: "capitalize"  }}>
                            Mother’s Name : {marksheetData?.studentDetails?.motherName}
                        </Text>
                        <Text style={{ paddingBottom: "4px", textTransform: "capitalize" }}>
                            Father’s Name : {marksheetData?.studentDetails?.fatherName}
                        </Text>
                        <Text style={{ paddingBottom: "4px" }}>
                            Address : {marksheetData?.studentDetails?.villagePost}, {marksheetData?.studentDetails?.district}, {marksheetData?.studentDetails?.state} {marksheetData?.studentDetails?.pincode}, {marksheetData?.studentDetails?.country}{" "}
                        </Text>
                    </View>
                    <View style={{ ...styles.detailsCol, borderLeft: "1pt solid #222" }}>
                        <Text style={{ paddingBottom: "4px" }}>Roll No : {marksheetData?.studentDetails?.rollNo}</Text>
                        <Text style={{ paddingBottom: "4px" }}>DOB : {new Date(marksheetData?.studentDetails?.dob).toLocaleDateString("en-GB")}{"\n"}</Text>
                        <Text style={{ paddingBottom: "4px" }}>
                            Contact no : {marksheetData?.studentDetails?.phone}
                        </Text>

                    </View>
                </View>
            </View>

            {/* Academic Performance Table */}

            <View style={styles.table}>
                <Text
                    style={[styles.sectionAcademicTitle, { backgroundColor: "#8fd18f" }]}
                >
                    Academic Performance : {marksheetData?.examType}
                </Text>
                <View style={styles.tableHeader}>
                    <Text style={styles.tableCellHeader}>Subject</Text>
                    <Text style={styles.tableCellHeader}>Subject's Full Marks</Text>
                    <Text style={styles.tableCellHeader}>Written</Text>
                    <Text style={styles.tableCellHeader}>Project's Full Marks</Text>
                    <Text style={styles.tableCellHeader}>Project</Text>
                    <Text style={styles.tableCellHeader}>Total</Text>
                    <Text style={styles.tableCellHeader}>Grade</Text>
                </View>
                {marksheetData?.subjects.map((subject, idx) => (
                    <View style={styles.tableRow} key={idx}>
                        <Text style={[styles.tableCell, styles.capitalize]} >{subject?.subject}</Text>
                        <Text style={styles.tableCell}>{subject?.subjectFullMark}</Text>
                        <Text style={styles.tableCell}>{subject?.writtenMarks}</Text>
                        <Text style={styles.tableCell}>{subject?.projectFullMark}</Text>
                        <Text style={styles.tableCell}>{subject?.projectMarks}</Text>
                        <Text style={styles.tableCell}>{subject?.totalMarks}</Text>
                        <Text style={styles.tableCell}>{subject?.grade || "Additional"}</Text>

                    </View>
                ))}
            </View>

            {/* Co-Scholastic Areas */}

            <View style={styles.table}>
                <Text style={styles.coScholasticHeader}>
                    Grand Total & Result
                </Text>
                {Object.entries({
                    "TOTAL MARKS": `${totalExamMarks}`,
                    "TOTAL MARKS OBTAINED": `${marksheetData.totalMarks}`,
                    "GRADE": `${marksheetData.overallGrade}`,
                    "RESULT": `${marksheetData.result}`,
                }).map(([area, grade], idx) => (
                    <View style={styles.coScholasticRow} key={idx}>
                        <Text style={styles.coScholasticCell}>{area}</Text>
                        <Text style={styles.coScholasticCellGrade}>{grade}</Text>
                    </View>
                ))}
                <View style={styles.coScholasticRow}>
                    .
                    <Text
                        style={{
                            flex: 3,
                            padding: 8,
                            textAlign: "left",
                            borderRight: "none",
                        }}
                    ></Text>
                </View>
                <View style={styles.coScholasticRow}>
                    .
                    <Text
                        style={{
                            flex: 3,
                            padding: 2,
                            textAlign: "left",
                            borderRight: "none",
                            fontSize: 12,
                        }}
                    >
                        Class Teacher Remarks :
                    </Text>
                </View>
            </View>

            {/* Remarks, Date, Place, Signatures */}
            <View
                style={{
                    border: "1pt solid #222",
                    borderRadius: 4,
                    padding: 8,
                    marginTop: 10,
                }}
            >
                <View style={styles.detailsRow}>
                    <Text>Date :</Text>
                </View>
                <View style={[styles.signatureRow, { alignItems: "flex-end", marginTop: 10 }]}>
                    <Text>Place :</Text>
                    <Text>Class Teacher</Text>
                    <View style={{ alignItems: "center", width: 100 }}>
                        {signaturePreview ? (
                            <Image
                                src={signaturePreview}
                                style={{ width: 90, height: 45, marginBottom: 0 }}
                            />
                        ) : (
                            <View style={{ height: 50 }} />
                        )}
                        <Text>Principal</Text>
                    </View>
                </View>
                
            </View>

            {/* notes section  */}
            <View style={styles.notesSection}>
                <Text style={{ fontSize: 11, fontWeight: "bold", marginBottom: 4 }}>
                    KEEP NOTES:
                </Text>
                <View style={styles.noteItem}>
                    <Text style={{ width: 20 }}>P</Text>
                    <Text>- For Successful Students</Text>
                </View>
                <View style={styles.noteItem}>
                    <Text style={{ width: 20 }}>F</Text>
                    <Text>- For Unsuccessful Students</Text>
                </View>
            </View>

            {/* Additional Information */}
            <View style={{ marginTop: 20, fontSize: 9 }}>
                <Text style={{ marginBottom: 8 }}>
                    Note: This is a computer-generated report card and does not require a signature.
                </Text>
                <Text>
                    For any discrepancies, please contact the school administration within 7 days of issue.
                </Text>
            </View>

            <View style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center" }}>
                <Text style={{ fontSize: 8, color: "#666" }}>
                    Generated by {institute.schoolName} School Management System
                </Text>
            </View>
        </Page>


    </Document>
);

const NewMarksheetComponent = ({ marksheetData, gradeSystem,signaturePreview,additionalMarksheetData }) => {
    const { theme } = useTheme();
    const darkMode = theme === "light";
    // console.log("additionalMarksheetData", marksheetData.roll);

    const schoolId = useSelector((state) => state?.auth?.schoolId);
    const institute = useSelector((state) => state.institute.institute); 

    const additionalSubjects = additionalMarksheetData.filter(
        (item) => item.roll == marksheetData?.roll
    );

    const allMarkSheetData = additionalSubjects?.length > 0 ? {
        ...marksheetData,
        subjects: [...marksheetData?.subjects, ...additionalSubjects?.[0]?.subjects]
    } : marksheetData;

    // console.log("allMarkSheetData", allMarkSheetData);
    const totalExamMarks = marksheetData?.subjects.reduce((acc, subject) => acc + +subject.subjectFullMark + +subject.projectFullMark, 0)

    const handleDownload = async () => {
        const blob = await pdf(<PdfDocument marksheetData={allMarkSheetData} gradeSystem={gradeSystem} institute={institute} totalExamMarks={totalExamMarks} signaturePreview={signaturePreview} />).toBlob();
        saveAs(blob, `Marksheet_${marksheetData?.studentDetails.studentName}_${marksheetData?.studentDetails?.className}_${marksheetData?.studentDetails?.section}_${marksheetData.examType}.pdf`);
    };


    return (
        <Dialog>
            <DialogTrigger asChild>
                {/* <Button
                    className={`flex items-center gap-2 text-white ${darkMode
                        ? "bg-[#2563eb] hover:bg-[#1d4ed8]"
                        : "bg-[#452B90] hover:bg-[#352072]"
                        }`}
                >
                    Download
                </Button> */}

                <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300"
                >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                </Button>
            </DialogTrigger>

            <DialogContent
                className={`sm:max-w-[900px]  max-w-[95%] ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white"
                    }`}
            >
                <DialogHeader>
                    <DialogTitle
                        className={`border-b pb-3 ${darkMode
                            ? "border-gray-700 text-white"
                            : "border-gray-200 text-gray-900"
                            }`}
                    >
                        Download <span className="font-bold text-blue-500 underline capitalize">  {marksheetData?.studentDetails?.studentName}'s {marksheetData?.examType}</span> Marksheet
                    </DialogTitle>
                </DialogHeader>
                <PDFViewer width="100%" height={700} showToolbar={true} >
                    <PdfDocument institute={institute} marksheetData={allMarkSheetData} gradeSystem={gradeSystem} totalExamMarks={totalExamMarks} signaturePreview={signaturePreview} />
                </PDFViewer>
                <div className="mt-4 flex justify-end">
                    <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white">
                        Download PDF
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default NewMarksheetComponent;
