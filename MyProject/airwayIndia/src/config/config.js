const config = {
    planUrl: `${import.meta.env.VITE_BASE_URL}/api/v1`,
    studentUrl: `${import.meta.env.VITE_BASE_URL}/api/v1`,
    courseUrl: `${import.meta.env.VITE_BASE_URL}/api/v1`,
    paymentUrl: `${import.meta.env.VITE_BASE_URL}/api/v1/payments`,
    ChequeUrl: `${import.meta.env.VITE_BASE_URL}/api/v1/cheques`,
    ReceiptUrl: `${import.meta.env.VITE_BASE_URL}/api/v1/receipts`,
    sessionUrl: `${import.meta.env.VITE_BASE_URL}/api/v1/sessions`,

}

export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const PlanUrl  = {
  getPlans: `${config.planUrl}/plans`,
  postPlan: `${config.planUrl}/plans`,
  deletePlan: `${config.planUrl}/plans`,
  updatePlan: `${config.planUrl}/plans`,
}

export const UpdateInstallment = {
  updateInstallment: `${config.paymentUrl}/update-installment-name`,
}

export const StudentUrl = {
  getStudents: `${config.studentUrl}/students`,
  postStudent: `${config.studentUrl}/students`,
  deleteStudent: `${config.studentUrl}/students`,
  importStudents: `${config.studentUrl}/students/upload-excel`,
  updateStudent: `${config.studentUrl}/students`,
  reportStudent: `${config.studentUrl}/students/report`,
  getSortStudents: `${config.studentUrl}/payments/student-with-history`,
  getDueStudents: `${config.studentUrl}/payments/due-payouts`,
  receiptPreview: `${config.studentUrl}/receipts/preview`,
  // getDueStudents: `${config.studentUrl}/payments/due-payouts`,
  receiptPreview: `${config.studentUrl}/receipts/preview`,
  receiptDownload: `${config.studentUrl}/receipts/download-by-payment`,
  exportInExcel: `${config.studentUrl}/reports/students/export`,
  exportInPdf: `${config.studentUrl}/reports/students/pdf`,
}

export const ChequeUrl = {
  postCheque: `${config.ChequeUrl}`,
  getCheques: `${config.ChequeUrl}`,
  getSummary: `${config.ChequeUrl}/summary`,
  putStatus: `${config.ChequeUrl}/status`,
  getSortCheques: `${config.ChequeUrl}/sort`,
  getStatusFilter: `${config.ChequeUrl}/status`,
  getBankFilter: `${config.ChequeUrl}/bank`,
}
//payment and receipt
export const PaymentUrl ={
  getStudentPayment: `${config.paymentUrl}/student-with-history`,
  getPayments: `${config.paymentUrl}/fees-collection`,
  studentSearch:`${config.studentUrl}/students/search`,
  postPayment:`${config.paymentUrl}`,

  receiptDownload : `${config.ReceiptUrl}/download-by-payment`,
  paymentFilter : `${config.paymentUrl}/filter`,
  feesCollection : `${config.paymentUrl}/fees-collection`,
  getReceipts : `${config.ReceiptUrl}`,
  sortedPayment : `${config.paymentUrl}/filter?sortBy=NEWEST_TO_OLDEST`,
  // viewReceipt : `http://192.168.0.156:8080/api/v1/receipts/preview/6882167b54a9c25e5bb3a0d1`,
}
export const CourseUrl = {
  getCourses: `${config.courseUrl}/courses`,
  postCourse: `${config.courseUrl}/courses`,
  deleteCourse: `${config.courseUrl}/courses`,
  updateCourse: `${config.courseUrl}/courses`,
}

export const SessionUrl = {
  getSessions: `${config.sessionUrl}`,
  postSession: `${config.sessionUrl}`,
  deleteSession: `${config.sessionUrl}`,
  updateSession: `${config.sessionUrl}`,
}
export const DashboardUrl = {
  getDashboard: `${config.paymentUrl}/dashboard`,
  getPaymentSummary : `${config.paymentUrl}/payments/due-students`,
  getPaymentDue : `${config.paymentUrl}/payments/summary`,
  getRecentPayments: `${config.paymentUrl}/recent-payments`,
}