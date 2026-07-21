package com.rahul.Drasta.Service;

import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.rahul.Drasta.Exception.NotFoundException;
import com.rahul.Drasta.Model.Donate;
import com.rahul.Drasta.Model.PaymentDetails;
import com.rahul.Drasta.Repository.DonateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class ReceiptService {

    @Autowired
    private DonateRepository donateRepository;
    
    @Autowired
    private NotificationService notificationService;

    /**
     * Generate a receipt for a single donation
     */
    public byte[] generateReceipt(String donationId) throws IOException {
        // Fetch donation details
        Donate donation = donateRepository.findById(donationId)
                .orElseThrow(() -> new NotFoundException("Donation record not found"));

        return generateReceiptPdf(donation);
    }

    /**
     * Generate receipts for multiple donations and package them in a ZIP file
     */
    public byte[] generateBulkReceipts(List<String> donationIds) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ZipOutputStream zipOut = new ZipOutputStream(baos);

        for (String donationId : donationIds) {
            try {
                Donate donation = donateRepository.findById(donationId)
                        .orElseThrow(() -> new NotFoundException("Donation record not found: " + donationId));
                
                byte[] receiptBytes = generateReceiptPdf(donation);
                
                // Create a ZIP entry for this receipt
                String entryName = "Receipt_" + donation.getId() + "_" + donation.getName().replaceAll("\\s+", "_") + ".pdf";
                ZipEntry zipEntry = new ZipEntry(entryName);
                zipOut.putNextEntry(zipEntry);
                zipOut.write(receiptBytes);
                zipOut.closeEntry();
            } catch (Exception e) {
                // Log error but continue with other receipts
                System.err.println("Error generating receipt for donation ID " + donationId + ": " + e.getMessage());
            }
        }

        zipOut.close();
        return baos.toByteArray();
    }

    /**
     * Helper method to generate the actual PDF receipt
     */
    private byte[] generateReceiptPdf(Donate donation) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf, PageSize.A4);
        document.setMargins(20, 20, 20, 20);

        // Set up fonts
        PdfFont titleFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
        PdfFont bodyFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);

        // Create a border for the receipt
        DeviceRgb borderColor = new DeviceRgb(0, 102, 204); // Blue color
        SolidBorder border = new SolidBorder(borderColor, 2);

        // Create a table for the receipt layout
        Table table = new Table(UnitValue.createPercentArray(1)).useAllAvailableWidth();
        table.setBorder(border);
        table.setMarginTop(10);
        table.setMarginBottom(10);

        // Receipt header
        Cell headerCell = new Cell();
        headerCell.setBorder(Border.NO_BORDER);
        headerCell.setPadding(20);
        headerCell.setBackgroundColor(new DeviceRgb(240, 248, 255)); // Light blue background

        Paragraph orgName = new Paragraph("Drasta Foundation")
                .setFont(titleFont)
                .setFontSize(24)
                .setFontColor(new DeviceRgb(0, 51, 102)) // Dark blue
                .setTextAlignment(TextAlignment.CENTER);

        Paragraph receiptTitle = new Paragraph("Donation Receipt")
                .setFont(titleFont)
                .setFontSize(28)
                .setFontColor(new DeviceRgb(0, 102, 204)) // Blue
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(20);

        headerCell.add(orgName);
        headerCell.add(receiptTitle);
        table.addCell(headerCell);

        // Receipt body
        Cell bodyCell = new Cell();
        bodyCell.setBorder(Border.NO_BORDER);
        bodyCell.setPadding(30);

        // Receipt number and date
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM d, yyyy");
        LocalDateTime receiptDate = LocalDateTime.now();
        String receiptNumber = "RCPT-" + donation.getId();

        Paragraph receiptInfo = new Paragraph("Receipt #: " + receiptNumber + "\nDate: " + receiptDate.format(formatter))
                .setFont(bodyFont)
                .setFontSize(12)
                .setTextAlignment(TextAlignment.RIGHT);

        // Donor information
        Paragraph donorTitle = new Paragraph("Donor Information")
                .setFont(titleFont)
                .setFontSize(16)
                .setMarginTop(20);

        Paragraph donorInfo = new Paragraph(
                "Name: " + donation.getName() + "\n" +
                "Email: " + donation.getEmail())
                .setFont(bodyFont)
                .setFontSize(12)
                .setMarginTop(10);

        // Donation details
        Paragraph donationTitle = new Paragraph("Donation Details")
                .setFont(titleFont)
                .setFontSize(16)
                .setMarginTop(20);

        // Create a table for payment details
        Table paymentTable = new Table(UnitValue.createPercentArray(new float[]{2, 2, 3, 3}))
                .useAllAvailableWidth();

        // Add headers
        Cell headerPaymentId = new Cell().add(new Paragraph("Payment ID").setFont(titleFont).setFontSize(12));
        Cell headerOrderId = new Cell().add(new Paragraph("Order ID").setFont(titleFont).setFontSize(12));
        Cell headerAmount = new Cell().add(new Paragraph("Amount").setFont(titleFont).setFontSize(12));
        Cell headerDate = new Cell().add(new Paragraph("Date").setFont(titleFont).setFontSize(12));

        paymentTable.addHeaderCell(headerPaymentId);
        paymentTable.addHeaderCell(headerOrderId);
        paymentTable.addHeaderCell(headerAmount);
        paymentTable.addHeaderCell(headerDate);

        // Add payment details
        if (donation.getPaymentDetails() != null && !donation.getPaymentDetails().isEmpty()) {
            for (PaymentDetails payment : donation.getPaymentDetails()) {
                paymentTable.addCell(new Cell().add(new Paragraph(payment.getPaymentId() != null ? payment.getPaymentId() : "-").setFont(bodyFont).setFontSize(12)));
                paymentTable.addCell(new Cell().add(new Paragraph(payment.getOrderId() != null ? payment.getOrderId() : "-").setFont(bodyFont).setFontSize(12)));
                paymentTable.addCell(new Cell().add(new Paragraph("₹" + String.format("%.2f", payment.getPaidAmount())).setFont(bodyFont).setFontSize(12)));
                paymentTable.addCell(new Cell().add(new Paragraph(payment.getPaidOn() != null ? payment.getPaidOn().format(DateTimeFormatter.ofPattern("MMM d, yyyy HH:mm")) : "-").setFont(bodyFont).setFontSize(12)));
            }
        } else {
            // If no payment details, show the main donation info
            paymentTable.addCell(new Cell().add(new Paragraph(donation.getTransactionId() != null ? donation.getTransactionId() : "-").setFont(bodyFont).setFontSize(12)));
            paymentTable.addCell(new Cell().add(new Paragraph("-").setFont(bodyFont).setFontSize(12)));
            paymentTable.addCell(new Cell().add(new Paragraph("₹" + String.format("%.2f", donation.getDonateAmount())).setFont(bodyFont).setFontSize(12)));
            paymentTable.addCell(new Cell().add(new Paragraph(donation.getPaidOne() != null ? donation.getPaidOne().format(DateTimeFormatter.ofPattern("MMM d, yyyy HH:mm")) : "-").setFont(bodyFont).setFontSize(12)));
        }

        // Total amount
        Paragraph totalAmount = new Paragraph("Total Amount: ₹" + String.format("%.2f", donation.getDonateAmount()))
                .setFont(titleFont)
                .setFontSize(14)
                .setTextAlignment(TextAlignment.RIGHT)
                .setMarginTop(10);

        // Payment mode and status
        Paragraph paymentInfo = new Paragraph(
                "Payment Mode: " + (donation.getPaymentMode() != null ? donation.getPaymentMode() : "N/A") + "\n" +
                "Payment Type: " + (donation.getPaymentType() != null ? donation.getPaymentType() : "N/A") + "\n" +
                "Status: " + (donation.getStatus() != null ? donation.getStatus() : "N/A"))
                .setFont(bodyFont)
                .setFontSize(12)
                .setMarginTop(10);

        // Note if available
        if (donation.getNote() != null && !donation.getNote().isEmpty()) {
            Paragraph noteTitle = new Paragraph("Note:")
                    .setFont(titleFont)
                    .setFontSize(14)
                    .setMarginTop(20);

            Paragraph noteText = new Paragraph(donation.getNote())
                    .setFont(bodyFont)
                    .setFontSize(12)
                    .setMarginTop(5);

            bodyCell.add(noteTitle);
            bodyCell.add(noteText);
        }

        // Add all elements to the body cell
        bodyCell.add(receiptInfo);
        bodyCell.add(donorTitle);
        bodyCell.add(donorInfo);
        bodyCell.add(donationTitle);
        bodyCell.add(paymentTable);
        bodyCell.add(totalAmount);
        bodyCell.add(paymentInfo);
        table.addCell(bodyCell);

        // Receipt footer
        Cell footerCell = new Cell();
        footerCell.setBorder(Border.NO_BORDER);
        footerCell.setPadding(20);
        footerCell.setBackgroundColor(new DeviceRgb(240, 248, 255)); // Light blue background

        Paragraph thankYou = new Paragraph("Thank you for your generous donation!")
                .setFont(titleFont)
                .setFontSize(16)
                .setTextAlignment(TextAlignment.CENTER);

        Paragraph taxInfo = new Paragraph("This receipt may be used for tax deduction purposes.")
                .setFont(bodyFont)
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(10);

        Paragraph contactInfo = new Paragraph("For any queries, please contact us at: support@drastafoundation.org")
                .setFont(bodyFont)
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(20);

        footerCell.add(thankYou);
        footerCell.add(taxInfo);
        footerCell.add(contactInfo);
        table.addCell(footerCell);

        document.add(table);
        document.close();

        return baos.toByteArray();
    }
    
    /**
     * Send receipt via email
     */
    public void emailReceipt(String donationId) {
        try {
            Donate donation = donateRepository.findById(donationId)
                    .orElseThrow(() -> new NotFoundException("Donation record not found"));
            
            byte[] receiptBytes = generateReceiptPdf(donation);
            
            // Here you would use NotificationService to send the email with attachment
            // This is a placeholder for the implementation
            // notificationService.sendDonationReceiptEmail(donation, receiptBytes);
            
            // For now, we'll just log that we would send the email
            System.out.println("Would send receipt email to: " + donation.getEmail());
        } catch (Exception e) {
            System.err.println("Failed to email receipt: " + e.getMessage());
        }
    }
}