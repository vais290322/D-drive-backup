import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const PRIMARY = "#1e40af";
const BORDER = "#94a3b8";
const TEXT = "#0f172a";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9,
    fontFamily: "Helvetica",
    backgroundColor: "#fff",
  },

  schoolHeader: {
    flexDirection: "row",
    borderBottom: `2px solid ${PRIMARY}`,
    paddingBottom: 8,
    marginBottom: 10,
  },
  schoolLogo: { width: 50, height: 50, marginRight: 10 },
  schoolText: { flex: 1, textAlign: "center" },
  schoolName: { fontSize: 14, fontWeight: "bold", color: PRIMARY },
  schoolMeta: { fontSize: 8 },

  title: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    marginVertical: 8,
    textTransform: "uppercase",
  },

  studentTop: {
    flexDirection: "row",
    border: `1px solid ${BORDER}`,
    padding: 8,
    marginBottom: 10,
  },
  photoBox: {
    width: 70,
    height: 85,
    border: `1px solid ${BORDER}`,
    alignItems: "center",
    justifyContent: "center",
  },
  studentTopInfo: {
    flex: 1,
    marginLeft: 10,
  },

  /* ===== Sections ===== */
  section: {
    border: `1px solid ${BORDER}`,
    padding: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 6,
    color: PRIMARY,
    // borderBottom: `1px solid ${BORDER}`,
    paddingBottom: 2,
  },

  row: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 6,
  },

  field: {
    flex: 1,
    border: `1px solid ${BORDER}`,
    padding: 4,
    minHeight: 28,
  },

  label: {
    fontSize: 7,
    color: "#475569",
    marginBottom: 2,
  },

  value: {
    fontSize: 9,
    fontWeight: "bold",
    color: TEXT,
  },

  footer: {
    textAlign: "center",
    fontSize: 7,
    marginTop: 10,
    color: "#64748b",
  },
  paymentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  paymentItem: {
    width: "23%", // 4 columns
    border: `1px solid ${BORDER}`,
    padding: 6,
    marginBottom: 6,
  },

  paymentLabel: {
    fontSize: 7,
    color: "#475569",
    marginBottom: 2,
  },

  paymentValue: {
    fontSize: 9,
    fontWeight: "bold",
    color: TEXT,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 18, // forces vertical centering
  },

  labelSide: {
    width: "45%",
    fontSize: 7,
    color: "#475569",
    lineHeight: 1.4,
  },

  valueSide: {
    width: "55%",
    fontSize: 9,
    fontWeight: "bold",
    color: TEXT,
    lineHeight: 1.4,
    paddingLeft: 2,
  },
});

const StudentInformationPDFComponent = ({ student, schooldetails, classFee }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* ===== School Header ===== */}
      <View style={styles.schoolHeader}>
        {schooldetails?.schoolLogo && (
          <Image src={schooldetails.schoolLogo} style={styles.schoolLogo} />
        )}
        <View style={styles.schoolText}>
          <Text style={styles.schoolName}>{schooldetails?.schoolName}</Text>
          <Text style={styles.schoolMeta}>{schooldetails?.schoolAddress}</Text>
          <Text >Mob: {schooldetails?.schoolPhone}</Text>
          
        </View>
      
      </View>

      <Text style={styles.title}>Student Admission Form</Text>

      {/* ===== Student Header ===== */}
      <View style={styles.studentTop}>
        <View style={styles.photoBox}>
          {student?.studentImage ? (
            <Image src={student.studentImage} />
          ) : (
            <Text>Photo</Text>
          )}
        </View>

        <View style={styles.studentTopInfo}>
          <View style={styles.row}>
            <Text style={styles.label}>Student Name</Text>
            <Text style={styles.value}>{student?.studentName || "-"}</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Class / Section</Text>
              <Text style={styles.value}>
                {student?.className} ({student?.section})
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* ===== Student Information ===== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Student Information</Text>

        <View style={styles.row}>
          <Field label="Admission No" value={student?.admissionNumber} />
          <Field label="Roll No" value={student?.rollNo} />
          <Field label="Academic Year" value={student?.academicYear} />
        </View>

        <View style={styles.row}>
          <Field label="Admission Date" value={student?.admissionDate} />
          <Field label="Date of Birth" value={student?.dob} />
          <Field label="Gender" value={student?.gender} />
        </View>

        <View style={styles.row}>
          <Field label="Blood Group" value={student?.bloodGroup} />
          <Field label="Religion" value={student?.religion} />
        </View>
        {/* <View style={styles.photoBox}>
          {student?.jointImage ? (
            <Image src={student.jointImage} />
          ) : (
            <Text>Photo</Text>
          )}
        </View> */}
      </View>

      {/* ===== Contact & Address ===== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact & Address</Text>

        <View style={styles.row}>
          <Field label="Phone" value={student?.phone} />
          <Field label="Alternative Phone" value={student?.alternativePhone} />
        </View>

        <View style={styles.row}>
          <Field label="Email" value={student?.email} />
        </View>

        <View style={styles.row}>
          <Field label="Village / Post" value={student?.villagePost} />
          <Field label="Police Station" value={student?.policeStation} />
        </View>

        <View style={styles.row}>
          <Field label="District" value={student?.district} />
          <Field label="State" value={student?.state} />
          <Field label="Pin Code" value={student?.pincode} />
        </View>
      </View>
      {/* ===== Payment Details ===== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Details</Text>

        <View style={styles.paymentGrid}>
          {[
            {
              label: "Admission Fee",
              value: classFee?.admission_Fees,
            },
            { label: "Tuition Fee", value: classFee?.tuitionFees },
            { label: "Donation", value: classFee?.donation },
            { label: "Books Fee", value: classFee?.books },
            {
              label: "ID Card Charges",
              value: classFee?.id_Card_Charges,
            },

            { label: "Late Fee", value: classFee?.late_Fees },
            { label: "Fine Fee", value: classFee?.fine },
            { label: "Miscellaneous", value: classFee?.miscellaneous },
            {
              label: "Uniform Charges",
              value: classFee?.uniform_Charges,
            },
            {
              label: "Transportation Fee",
              value: classFee?.transportationalFees,
            },
            { label: "Other Fee", value: classFee?.other },
            { label: "Total Amount", value: classFee?.totalFees },
          ].map((item, index) => (
            <View style={styles.paymentItem}>
              <View style={styles.fieldRow}>
                <Text style={styles.labelSide}>{item.label}</Text>
                <Text style={styles.valueSide}>{item.value ?? "N/A"}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.footer}>
        This is a system-generated admission form.
      </Text>
    </Page>
  </Document>
);

/* ===== Reusable Field ===== */
const Field = ({ label, value }) => (
  <View style={styles.field}>
    <View style={styles.fieldRow}>
      <Text style={styles.labelSide}>{label}</Text>
      <Text style={styles.valueSide}>{value || "-"}</Text>
    </View>
  </View>
);

export default StudentInformationPDFComponent;

