package com.rahul.Drasta.Service;

import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import com.rahul.Drasta.Exception.NotFoundException;
import com.rahul.Drasta.Model.EventParticipation;
import com.rahul.Drasta.Model.Volunteer;
import com.rahul.Drasta.Repository.EventParticipationRepository;
import com.rahul.Drasta.Repository.VolunteerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class CertificateService {

    @Autowired
    private EventParticipationRepository participationRepository;

    @Autowired
    private VolunteerRepository volunteerRepository;
    
    @Autowired
    private NotificationService notificationService; // Add NotificationService dependency

    public byte[] generateCertificate(String participationId, String volunteerId) throws IOException {
        // Fetch participation details
        EventParticipation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new NotFoundException("Participation record not found"));

        // Verify this participation belongs to the volunteer
        if (!participation.getVolunteerId().equals(volunteerId)) {
            throw new NotFoundException("This participation record does not belong to the volunteer");
        }

        // Fetch volunteer details
        Volunteer volunteer = volunteerRepository.findById(volunteerId)
                .orElseThrow(() -> new NotFoundException("Volunteer not found"));

        // Generate PDF certificate
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf, PageSize.A4.rotate());
        document.setMargins(20, 20, 20, 20);

        // Set up fonts
        PdfFont titleFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
        PdfFont bodyFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);
        PdfFont headerFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

        // Create a border for the certificate
        DeviceRgb borderColor = new DeviceRgb(0, 102, 204); // Blue color
        SolidBorder border = new SolidBorder(borderColor, 2);

        // Create a table for the certificate layout
        Table table = new Table(UnitValue.createPercentArray(1)).useAllAvailableWidth();
        table.setBorder(border);
        table.setMarginTop(10);
        table.setMarginBottom(10);

        // Certificate header
        Cell headerCell = new Cell();
        headerCell.setBorder(Border.NO_BORDER);
        headerCell.setPadding(20);
        headerCell.setBackgroundColor(new DeviceRgb(240, 248, 255)); // Light blue background

        Paragraph orgName = new Paragraph("Drasta Foundation")
                .setFont(titleFont)
                .setFontSize(24)
                .setFontColor(new DeviceRgb(0, 51, 102)) // Dark blue
                .setTextAlignment(TextAlignment.CENTER);

        Paragraph certTitle = new Paragraph("Certificate of Participation")
                .setFont(titleFont)
                .setFontSize(28)
                .setFontColor(new DeviceRgb(0, 102, 204)) // Blue
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(20);

        headerCell.add(orgName);
        headerCell.add(certTitle);
        table.addCell(headerCell);

        // Certificate body
        Cell bodyCell = new Cell();
        bodyCell.setBorder(Border.NO_BORDER);
        bodyCell.setPadding(30);

        Paragraph intro = new Paragraph("This is to certify that")
                .setFont(bodyFont)
                .setFontSize(14)
                .setTextAlignment(TextAlignment.CENTER);

        Paragraph name = new Paragraph(volunteer.getFullName())
                .setFont(titleFont)
                .setFontSize(22)
                .setFontColor(new DeviceRgb(0, 102, 204)) // Blue
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(10)
                .setMarginBottom(10);

        Paragraph participationText = new Paragraph(
                "has successfully participated as a " + volunteer.getPreferredRole() + " in the event:")
                .setFont(bodyFont)
                .setFontSize(14)
                .setTextAlignment(TextAlignment.CENTER);

        Paragraph eventName = new Paragraph(participation.getEventTitle())
                .setFont(titleFont)
                .setFontSize(18)
                .setFontColor(new DeviceRgb(0, 102, 204)) // Blue
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(10)
                .setMarginBottom(10);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM d, yyyy");
        String dateRange = participation.getStartDate().format(formatter) + 
                (participation.getEndDate() != null ? " to " + participation.getEndDate().format(formatter) : "");

        Paragraph eventDate = new Paragraph("Date: " + dateRange)
                .setFont(bodyFont)
                .setFontSize(14)
                .setTextAlignment(TextAlignment.CENTER);

        Paragraph hoursContributed = new Paragraph("Total Hours Contributed: " + participation.getTotalHours())
                .setFont(bodyFont)
                .setFontSize(14)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(5);

        bodyCell.add(intro);
        bodyCell.add(name);
        bodyCell.add(participationText);
        bodyCell.add(eventName);
        bodyCell.add(eventDate);
        bodyCell.add(hoursContributed);
        table.addCell(bodyCell);

        // Certificate footer
        Cell footerCell = new Cell();
        footerCell.setBorder(Border.NO_BORDER);
        footerCell.setPadding(20);
        footerCell.setBackgroundColor(new DeviceRgb(240, 248, 255)); // Light blue background

        // Create a table for signatures
        Table signatureTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
                .useAllAvailableWidth();
        signatureTable.setBorder(Border.NO_BORDER);

        // Left signature
        Cell leftSignature = new Cell();
        leftSignature.setBorder(Border.NO_BORDER);
        leftSignature.setTextAlignment(TextAlignment.CENTER);

        Paragraph leftSignLine = new Paragraph("____________________")
                .setTextAlignment(TextAlignment.CENTER);
        Paragraph leftSignName = new Paragraph("Event Coordinator")
                .setFont(bodyFont)
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER);

        leftSignature.add(leftSignLine);
        leftSignature.add(leftSignName);

        // Right signature
        Cell rightSignature = new Cell();
        rightSignature.setBorder(Border.NO_BORDER);
        rightSignature.setTextAlignment(TextAlignment.CENTER);

        Paragraph rightSignLine = new Paragraph("____________________")
                .setTextAlignment(TextAlignment.CENTER);
        Paragraph rightSignName = new Paragraph("Director, Drasta Foundation")
                .setFont(bodyFont)
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER);

        rightSignature.add(rightSignLine);
        rightSignature.add(rightSignName);

        signatureTable.addCell(leftSignature);
        signatureTable.addCell(rightSignature);

        // Add issue date
        Paragraph issueDate = new Paragraph("Issued on: " + LocalDate.now().format(formatter))
                .setFont(bodyFont)
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(20);

        // Add certificate ID
        Paragraph certificateId = new Paragraph("Certificate ID: " + participationId)
                .setFont(bodyFont)
                .setFontSize(10)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(5);

        footerCell.add(signatureTable);
        footerCell.add(issueDate);
        footerCell.add(certificateId);
        table.addCell(footerCell);

        document.add(table);
        document.close();

        // After generating the certificate, send a notification
        // The download link would typically be constructed based on your application's URL structure
        String certificateDownloadLink = "/api/v1/certificates/download/" + participationId + "/" + volunteerId;
        notificationService.sendCertificateGenerationNotification(participation, volunteerId, certificateDownloadLink);
        return baos.toByteArray();
    }

    public byte[] generateMembershipCertificate(String volunteerId) throws IOException {
        // Fetch volunteer details
        Volunteer volunteer = volunteerRepository.findById(volunteerId)
                .orElseThrow(() -> new NotFoundException("Volunteer not found"));
    
        // Verify this volunteer is approved and active
        if (!volunteer.isActive() || !"APPROVED".equals(volunteer.getStatus())) {
            throw new NotFoundException("This volunteer is not approved or active");
        }
    
        // Generate PDF certificate
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf, PageSize.A4.rotate());
        document.setMargins(20, 20, 20, 20);
    
        // Set up fonts
        PdfFont titleFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
        PdfFont bodyFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);
        PdfFont headerFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
    
        // Create a border for the certificate
        DeviceRgb borderColor = new DeviceRgb(0, 102, 204); // Blue color
        SolidBorder border = new SolidBorder(borderColor, 2);
    
        // Create a table for the certificate layout
        Table table = new Table(UnitValue.createPercentArray(1)).useAllAvailableWidth();
        table.setBorder(border);
        table.setMarginTop(10);
        table.setMarginBottom(10);
    
        // Certificate header
        Cell headerCell = new Cell();
        headerCell.setBorder(Border.NO_BORDER);
        headerCell.setPadding(20);
        headerCell.setBackgroundColor(new DeviceRgb(240, 248, 255)); // Light blue background
    
        Paragraph orgName = new Paragraph("Drasta Foundation")
                .setFont(titleFont)
                .setFontSize(24)
                .setFontColor(new DeviceRgb(0, 51, 102)) // Dark blue
                .setTextAlignment(TextAlignment.CENTER);
    
        Paragraph certTitle = new Paragraph("Certificate of Membership")
                .setFont(titleFont)
                .setFontSize(28)
                .setFontColor(new DeviceRgb(0, 102, 204)) // Blue
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(20);
    
        headerCell.add(orgName);
        headerCell.add(certTitle);
        table.addCell(headerCell);
    
        // Certificate body
        Cell bodyCell = new Cell();
        bodyCell.setBorder(Border.NO_BORDER);
        bodyCell.setPadding(30);
    
        Paragraph intro = new Paragraph("This is to certify that")
                .setFont(bodyFont)
                .setFontSize(14)
                .setTextAlignment(TextAlignment.CENTER);
    
        Paragraph name = new Paragraph(volunteer.getFullName())
                .setFont(titleFont)
                .setFontSize(22)
                .setFontColor(new DeviceRgb(0, 102, 204)) // Blue
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(10)
                .setMarginBottom(10);
    
        Paragraph membershipText = new Paragraph(
                "is a verified and active volunteer of Drasta Foundation")
                .setFont(bodyFont)
                .setFontSize(16)
                .setTextAlignment(TextAlignment.CENTER);
    
        Paragraph roleText = new Paragraph("Volunteer Role: " + volunteer.getPreferredRole())
                .setFont(bodyFont)
                .setFontSize(14)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(10);
    
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM d, yyyy");
        LocalDateTime joinDate = volunteer.getCreatedAt();
        System.out.println(" join date : "+joinDate);
        String joinDateStr = joinDate != null ? joinDate.format(formatter) : "N/A";
    
        Paragraph joinDateText = new Paragraph("Member Since: " + joinDateStr)
                .setFont(bodyFont)
                .setFontSize(14)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(5);
    
        bodyCell.add(intro);
        bodyCell.add(name);
        bodyCell.add(membershipText);
        bodyCell.add(roleText);
        bodyCell.add(joinDateText);
        table.addCell(bodyCell);
    
        // Certificate footer
        Cell footerCell = new Cell();
        footerCell.setBorder(Border.NO_BORDER);
        footerCell.setPadding(20);
        footerCell.setBackgroundColor(new DeviceRgb(240, 248, 255)); // Light blue background
    
        // Create a table for signatures
        Table signatureTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
                .useAllAvailableWidth();
        signatureTable.setBorder(Border.NO_BORDER);
    
        // Left signature
        Cell leftSignature = new Cell();
        leftSignature.setBorder(Border.NO_BORDER);
        leftSignature.setTextAlignment(TextAlignment.CENTER);
    
        Paragraph leftSignLine = new Paragraph("____________________")
                .setTextAlignment(TextAlignment.CENTER);
        Paragraph leftSignName = new Paragraph("Volunteer Coordinator")
                .setFont(bodyFont)
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER);
    
        leftSignature.add(leftSignLine);
        leftSignature.add(leftSignName);
    
        // Right signature
        Cell rightSignature = new Cell();
        rightSignature.setBorder(Border.NO_BORDER);
        rightSignature.setTextAlignment(TextAlignment.CENTER);
    
        Paragraph rightSignLine = new Paragraph("____________________")
                .setTextAlignment(TextAlignment.CENTER);
        Paragraph rightSignName = new Paragraph("Director, Drasta Foundation")
                .setFont(bodyFont)
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER);
    
        rightSignature.add(rightSignLine);
        rightSignature.add(rightSignName);
    
        signatureTable.addCell(leftSignature);
        signatureTable.addCell(rightSignature);
    
        // Add issue date
        Paragraph issueDate = new Paragraph("Issued on: " + LocalDate.now().format(formatter))
                .setFont(bodyFont)
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(20);
    
        // Add certificate ID
        Paragraph certificateId = new Paragraph("Certificate ID: " + volunteerId)
                .setFont(bodyFont)
                .setFontSize(10)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(5);
    
        footerCell.add(signatureTable);
        footerCell.add(issueDate);
        footerCell.add(certificateId);
        table.addCell(footerCell);
    
        document.add(table);
        document.close();
        
        return baos.toByteArray();
    }
}