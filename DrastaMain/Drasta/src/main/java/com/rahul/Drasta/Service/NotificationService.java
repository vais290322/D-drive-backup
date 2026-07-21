package com.rahul.Drasta.Service;

import com.rahul.Drasta.Model.EventParticipation;
import com.rahul.Drasta.auth.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Sends an email notification when a user registers for an event
     * @param participation The event participation record
     */
    public void sendEventRegistrationNotification(EventParticipation participation) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom("noreply@drasta.com");
            helper.setTo(participation.getEmail());
            helper.setSubject("Event Registration Confirmation: " + participation.getEventTitle());
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM d, yyyy");
            String eventDate = participation.getStartDate().format(formatter);
            if (participation.getEndDate() != null) {
                eventDate += " to " + participation.getEndDate().format(formatter);
            }
            
            String htmlContent = String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Event Registration Confirmation</title>
                </head>
                <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #007bff;">Event Registration Confirmation</h2>
                        <p>Dear <strong>%s</strong>,</p>
                        <p>Thank you for registering for the following event:</p>
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="color: #333; margin-top: 0;">%s</h3>
                            <p><strong>Date:</strong> %s</p>
                            <p><strong>Location:</strong> %s</p>
                            <p><strong>Total Hours:</strong> %s</p>
                        </div>
                        <p>We're excited to have you join us! If you have any questions or need to make changes to your registration, please contact us.</p>
                        <p style="margin-top: 30px;">Best regards,<br>The Drasta Team</p>
                    </div>
                </body>
                </html>
                """, participation.getFullName(), 
                     participation.getEventTitle(),
                     eventDate,
                     participation.getLocation(),
                     participation.getTotalHours());
            
            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send event participation confirmation email: " + e.getMessage());
        }
    }

    /**
     * Sends an email notification when a certificate is generated
     * @param participation The event participation record
     * @param volunteerId The volunteer ID
     * @param certificateDownloadLink The link to download the certificate
     */
    public void sendCertificateGenerationNotification(EventParticipation participation, String volunteerId, String certificateDownloadLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom("noreply@drasta.com");
            helper.setTo(participation.getEmail());
            helper.setSubject("Your Certificate for " + participation.getEventTitle() + " is Ready");
            
            String htmlContent = String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Certificate Generated</title>
                </head>
                <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #007bff;">Your Certificate is Ready!</h2>
                        <p>Dear <strong>%s</strong>,</p>
                        <p>We're pleased to inform you that your certificate for participating in <strong>%s</strong> has been generated and is ready for download.</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="%s" style="background-color: #007bff; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                Download Certificate
                            </a>
                        </div>
                        
                        <p>Thank you for your valuable contribution to this event. We appreciate your dedication and hope to see you at future events!</p>
                        
                        <p style="margin-top: 30px;">Best regards,<br>The Drasta Team</p>
                    </div>
                </body>
                </html>
                """, participation.getFullName(), 
                     participation.getEventTitle(),
                     certificateDownloadLink);
            
            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send certificate generation notification email: " + e.getMessage());
        }
    }
}