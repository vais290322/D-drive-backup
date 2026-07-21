import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function AdmitCardComponent() {


const downloadPDF = () => {
    const admitCard = document.getElementById("admit-card");
    html2canvas(admitCard, { scale: 1.5 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 0.5); // Lower quality for smaller size (50%)
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, "", "FAST"); // Use FAST compression
      pdf.save("AdmitCard.pdf");
    });
  };


  return (
    <section>
      <div className="container mx-auto p-4">
        <button
          onClick={downloadPDF}
          className="bg-blue-500 text-white px-4 py-2 mb-4 rounded"
        >
          Download Admit Card as PDF
        </button>

        <div id="admit-card" className="admit-card border-2 p-4 my-4">
          <div className="BoxA border p-4 mb-4">
            <div className="flex">
              <div className="w-1/3">
                <h5 className="text-xl font-semibold">MEWAR UNIVERSITY</h5>
                <p className="text-sm">
                  NH - 79 Gangrar Chittorgarh - 312901 <br /> RAJASTHAN, INDIA
                </p>
              </div>
              <div className="w-1/3 text-center">
                <img
                  src="https://picsum.photos/300/200"
                  width="100px"
                  alt="Mewar University"
                />
              </div>
              <div className="w-1/3">
                <h5 className="text-xl font-semibold">Admit Card</h5>
                <p className="text-sm">B.Tech - 2019</p>
              </div>
            </div>
          </div>

          <div className="BoxC border p-4 mb-4">
            <div className="flex">
              <div className="w-1/2">
                <h5 className="text-lg font-semibold">Enrollment No : 9910101</h5>
              </div>
            </div>
          </div>

          <div className="BoxD border p-4 mb-4">
            <div className="flex">
              <div className="w-5/6">
                <table className="table-auto border-collapse w-full">
                  <tbody>
                    <tr>
                      <td className="border p-2 font-bold">ENROLLMENT NO : 9910101</td>
                      <td className="border p-2 font-bold">Course: B.TECH</td>
                    </tr>
                    <tr>
                      <td className="border p-2"><b>Student Name: </b>Vinod Sharma</td>
                      <td className="border p-2"><b>Sex: </b>M</td>
                    </tr>
                    <tr>
                      <td className="border p-2"><b>Father/Husband Name: </b>SS Sharma</td>
                      <td className="border p-2"><b>DOB: </b>02 Jul 2019</td>
                    </tr>
                    <tr>
                      <td colSpan="2" className="border p-2" style={{ height: "125px" }}>
                        <b>Address: </b>moh hasnxgxums, moh hasnxgxums, moh hasnxgxums
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="w-1/6 text-center">
                <table className="table-auto border-collapse w-full">
                  <tbody>
                    <tr>
                      <th scope="row">
                        <img
                          src="https://picsum.photos/200/200"
                          width="123px"
                          height="165px"
                          alt="Student"
                        />
                      </th>
                    </tr>
                    <tr>
                      <th scope="row">
                        <img src="https://picsum.photos/100/50" alt="Signature" />
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="BoxE border p-4 mb-4 text-center">
            <div className="flex">
              <div className="w-full">
                <h5 className="text-lg font-semibold">EXAMINATION VENUE</h5>
                <p className="text-sm">
                  NH - 79 Gangrar Chittorgarh - 312901 <br /> RAJASTHAN, INDIA
                </p>
              </div>
            </div>
          </div>

          <div className="BoxF border p-4 mb-4 text-center">
            <div className="flex">
              <div className="w-full">
                <table className="table-auto border-collapse w-full">
                  <thead>
                    <tr>
                      <th className="border p-2">Sr. No.</th>
                      <th className="border p-2">Subject/Paper</th>
                      <th className="border p-2">Exam Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">1</td>
                      <td className="border p-2">English</td>
                      <td className="border p-2">5 July 2019</td>
                    </tr>
                    <tr>
                      <td className="border p-2">2</td>
                      <td className="border p-2">English</td>
                      <td className="border p-2">5 July 2019</td>
                    </tr>
                    <tr>
                      <td className="border p-2">3</td>
                      <td className="border p-2">English</td>
                      <td className="border p-2">5 July 2019</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <footer className="text-center mt-4">
            <p>*** MEWAR UNIVERSITY ***</p>
          </footer>
        </div>
      </div>
    </section>
  );
}

export default AdmitCardComponent;
