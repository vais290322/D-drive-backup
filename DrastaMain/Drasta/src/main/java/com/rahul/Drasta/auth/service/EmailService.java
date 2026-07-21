package com.rahul.Drasta.auth.service;

import eu.bitwalker.useragentutils.UserAgent;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

@Service
public class EmailService {

    @Autowired
    public JavaMailSender mailSender;
    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        // Set the "from" address. This should be a valid email configured for your mail server.
        message.setFrom("noreply@192.168.0.156.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    public void sendResetPasswordHtmlEmail(String toEmail, String fullName, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("noreply@192.168.0.156.com");
            helper.setTo(toEmail);
            helper.setSubject("Password Reset Request");

            int year = Calendar.getInstance().get(Calendar.YEAR);
            String htmlContent = """
                    <!DOCTYPE html>
                    <html lang="en" style="font-family: Arial, sans-serif;">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Password Reset</title>
                    </head>
                    <body style="margin: 0; padding: 0; background-color: #f5f5f5;">
                        <table align="center" cellpadding="0" cellspacing="0" width="100%%" style="background-color: #f5f5f5; padding: 20px;">
                            <tr>
                                <td align="center">
                                    <table cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; padding: 40px;">
                                        <tr>
                                            <td align="center" style="padding-bottom: 20px;">
                                                <h2 style="color: #333;">Password Reset Request</h2>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p style="color: #555;">Hello %s,</p>
                                                <p style="color: #555;">
                                                    We received a request to reset your password. Click the button below to reset it:
                                                </p>
                                                <p style="text-align: center; margin: 30px 0;">
                                                    <a href="%s" style="background-color: #007bff; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                                        Reset Password
                                                    </a>
                                                </p>
                                                <p style="color: #999; font-size: 14px;">
                                                    This link is valid for 1 hour. If you didn’t request a password reset, you can safely ignore this email.
                                                </p>
                                                <p style="color: #555; margin-top: 30px;">
                                                    Regards,<br>
                                                    <strong>Drasta Team</strong>
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-top: 30px; font-size: 12px; color: #aaa; text-align: center;">
                                                &copy; %d Drasta. All rights reserved.
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                    </html>
                    """.formatted(fullName, resetLink, year);

            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Failed to send reset password email: " + e.getMessage());
        }
    }

    public void sendPasswordResetConfirmationEmail(String recipientEmail, String userName) {

       try {
           MimeMessage message = mailSender.createMimeMessage();
           MimeMessageHelper helper = new MimeMessageHelper(message, true);

           helper.setFrom("noreply@192.168.0.156.com");
           helper.setTo(recipientEmail);
           helper.setSubject("Your Drasta Password Has Been Successfully Changed");

           String htmlContent = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Password Reset Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #2c3e50;">Password Successfully Changed</h2>
                <p>Dear <strong>%s</strong>,</p>
                <p>This is to inform you that your password was successfully changed for your <strong>Drasta</strong> account.</p>
                <p>If this was done by you, no further action is needed.</p>
                <p>If you did not request this change, please reset your password immediately or contact our support team.</p>

                <hr style="margin: 20px 0;">
                <p style="font-size: 14px; color: #888888;">
                    This is an automated message from Drasta Security. Please do not reply.
                </p>

                <p style="font-size: 14px; color: #888888;">Best regards,<br>The Drasta Team</p>
            </div>
        </body>
        </html>
    """.formatted(userName);

           helper.setText(htmlContent, true);
           mailSender.send(message);
//           sendSimpleMessage(recipientEmail, subject, htmlContent);
       } catch (MessagingException e) {
           System.err.println("Failed to send reset password email: " + e.getMessage());
       }
    }


//    public void sendLoginAlert(String toEmail, String ipAddress, Date loginTime) {
//        try {
//            MimeMessage message = mailSender.createMimeMessage();
//            MimeMessageHelper helper = new MimeMessageHelper(message, true);
//
//            String formattedDate = new SimpleDateFormat("dd MMM yyyy, hh:mm a").format(loginTime);
//
//            helper.setFrom("noreply@192.168.0.156.com");
//            helper.setTo(toEmail);
//            helper.setSubject("Login Alert: New Login to Your Account");
//
//            String content = String.format("""
//                    <p>Hello,</p>
//                    <p>Your account was just logged in.</p>
//                    <p><strong>Details:</strong></p>
//                    <ul>
//                        <li><strong>Time:</strong> %s</li>
//                        <li><strong>IP Address:</strong> %s</li>
//                    </ul>
//                    <p>If this wasn't you, please reset your password immediately.</p>
//                    <p>– Drasta Security Team</p>
//                    """, formattedDate, ipAddress);
//
//            helper.setText(content, true);
//
//            mailSender.send(message);
//        } catch (MessagingException e) {
//            System.err.println("Failed to send login alert email: " + e.getMessage());
//            // Optionally log error or persist audit event
//        }
//    }
//public void sendLoginAlert(String toEmail, String ipAddress, Date loginTime) {
//    try {
//        MimeMessage message = mailSender.createMimeMessage();
//        MimeMessageHelper helper = new MimeMessageHelper(message, true);
//
//        String formattedDate = new SimpleDateFormat("dd MMM yyyy, hh:mm a").format(loginTime);
//
//        helper.setFrom("noreply@drasta.com"); // Replace with your actual email
//        helper.setTo(toEmail);
//        helper.setSubject("⚠️ Login Alert: New Login Detected");
//
//        String content = String.format("""
//            <!DOCTYPE html>
//            <html>
//            <head>
//                <meta charset="UTF-8">
//                <title>Login Alert</title>
//                <style>
//                    body {
//                        font-family: Arial, sans-serif;
//                        background-color: #f4f6f8;
//                        color: #333333;
//                        padding: 20px;
//                    }
//                    .container {
//                        max-width: 600px;
//                        margin: auto;
//                        background-color: #ffffff;
//                        padding: 30px;
//                        border-radius: 8px;
//                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
//                    }
//                    h2 {
//                        color: #e74c3c;
//                        margin-bottom: 20px;
//                    }
//                    table {
//                        width: 100%%;
//                        border-collapse: collapse;
//                        margin: 20px 0;
//                    }
//                    td {
//                        padding: 8px 12px;
//                        border-bottom: 1px solid #eee;
//                    }
//                    .footer {
//                        font-size: 13px;
//                        color: #888888;
//                        margin-top: 30px;
//                    }
//                    .btn {
//                        display: inline-block;
//                        padding: 10px 20px;
//                        background-color: #e74c3c;
//                        color: #ffffff;
//                        text-decoration: none;
//                        border-radius: 5px;
//                        margin-top: 15px;
//                    }
//                </style>
//            </head>
//            <body>
//                <div class="container">
//                    <h2>⚠️ New Login Alert</h2>
//                    <p>Hello,</p>
//                    <p>We noticed a new login to your <strong>Drasta</strong> account. Here are the details:</p>
//
//                    <table>
//                        <tr>
//                            <td>🕒 <strong>Time</strong></td>
//                            <td>%s</td>
//                        </tr>
//                        <tr>
//                            <td>🌐 <strong>IP Address</strong></td>
//                            <td>%s</td>
//                        </tr>
//                    </table>
//
//                    <p>If this was <strong>you</strong>, no further action is needed.</p>
//                    <p>If you <strong>did not</strong> perform this login, please secure your account immediately:</p>
//
//                    <a href="https://yourapp.com/reset-password" class="btn">Reset Password</a>
//
//                    <div class="footer">
//                        <p>This is an automated message from <strong>Drasta Security</strong>. Please do not reply.</p>
//                        <p>Stay safe,<br>The Drasta Team</p>
//                    </div>
//                </div>
//            </body>
//            </html>
//        """, formattedDate, ipAddress);
//
//        helper.setText(content, true);
//        mailSender.send(message);
//    } catch (MessagingException e) {
//        System.err.println("Failed to send login alert email: " + e.getMessage());
//        // Optionally log error or persist audit event
//    }
//}

//    public void sendLoginAlert(String toEmail, String userName, String ipAddress, Date loginTime, String location, String device, String browser, String loginMethod) {
//        try {
//            MimeMessage message = mailSender.createMimeMessage();
//            MimeMessageHelper helper = new MimeMessageHelper(message, true);
//
//            String formattedDate = new SimpleDateFormat("dd MMM yyyy, hh:mm a").format(loginTime);
//
//            helper.setFrom("noreply@drasta.com");
//            helper.setTo(toEmail);
//            helper.setSubject("🔐 New Login Alert - Drasta");
//
//            String htmlContent = String.format("""
//                <html>
//                <head>
//                    <style>
//                        body { font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; }
//                        .container { max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
//                        .header { background-color: #2c3e50; color: white; padding: 10px 20px; border-radius: 8px 8px 0 0; }
//                        .header h2 { margin: 0; font-size: 20px; }
//                        table { width: 100%%; margin-top: 20px; border-collapse: collapse; }
//                        td { padding: 8px 5px; border-bottom: 1px solid #ddd; }
//                        .footer { font-size: 12px; color: #999; margin-top: 20px; text-align: center; }
//                    </style>
//                </head>
//                <body>
//                    <div class="container">
//                        <div class="header">
//                            <h2>🔐 New Login Detected</h2>
//                        </div>
//                        <p>Hi <strong>%s</strong>,</p>
//                        <p>We noticed a new login to your <strong>Drasta</strong> account. If this was you, no further action is needed.</p>
//                        <table>
//                            <tr><td>👤 <strong>User</strong></td><td>%s</td></tr>
//                            <tr><td>🕒 <strong>Time</strong></td><td>%s</td></tr>
//                            <tr><td>📍 <strong>Location</strong></td><td>%s</td></tr>
//                            <tr><td>🌐 <strong>IP Address</strong></td><td>%s</td></tr>
//                            <tr><td>💻 <strong>Device</strong></td><td>%s</td></tr>
//                            <tr><td>🧭 <strong>Browser</strong></td><td>%s</td></tr>
//                            <tr><td>🔐 <strong>Login Method</strong></td><td>%s</td></tr>
//                        </table>
//                        <p>If you didn't initiate this login, please <a href="https://yourapp.com/reset-password">reset your password</a> immediately or contact our support team.</p>
//                        <div class="footer">
//                            This is an automated message from Drasta Security. Do not reply to this email.<br/>
//                            © 2025 Drasta. All rights reserved.
//                        </div>
//                    </div>
//                </body>
//                </html>
//                """, userName, toEmail, formattedDate, location, ipAddress, device, browser, loginMethod);
//
//            helper.setText(htmlContent, true);
//            mailSender.send(message);
//        } catch (MessagingException e) {
//            System.err.println("Failed to send login alert email: " + e.getMessage());
//        }
//    }

    public void sendLoginAlert(String toEmail,
                               String fullName,
                               HttpServletRequest request,
                               Date loginTime) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            String ipAddress = extractClientIpAddress(request);
            String userAgentString = request.getHeader("User-Agent");
            String acceptLanguage = request.getHeader("Accept-Language");
            String referer = request.getHeader("Referer");

            UserAgent userAgent = UserAgent.parseUserAgentString(userAgentString);
            String browser = userAgent.getBrowser().getName() + " " + userAgent.getBrowserVersion();
            String os = userAgent.getOperatingSystem().getName();
            String deviceType = userAgent.getOperatingSystem().getDeviceType().getName();

            String formattedDate = new SimpleDateFormat("dd MMM yyyy, hh:mm a").format(loginTime);

            helper.setTo(toEmail);
            helper.setSubject("🔐 Login Alert: New Login Detected");

            String html = """
            <html>
              <body style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 25px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                  <h2 style="color: #2c3e50;">👋 Hello %s,</h2>
                  <p>We noticed a new login to your <strong>Drasta</strong> account:</p>
                  <table style="width: 100%%; margin: 20px 0; border-collapse: collapse;">
                    <tr><td><strong>📍 IP Address:</strong></td><td>%s</td></tr>
                    <tr><td><strong>🧭 Browser:</strong></td><td>%s</td></tr>
                    <tr><td><strong>💻 Operating System:</strong></td><td>%s</td></tr>
                    <tr><td><strong>📱 Device Type:</strong></td><td>%s</td></tr>
                    <tr><td><strong>🌐 Language:</strong></td><td>%s</td></tr>
                    <tr><td><strong>🔗 Referer:</strong></td><td>%s</td></tr>
                    <tr><td><strong>🕒 Time:</strong></td><td>%s</td></tr>
                  </table>
                  <p>If this was you, you can ignore this message.</p>
                  <p>If not, we recommend <strong><a href="#">resetting your password</a></strong> immediately.</p>
                  <hr style="margin: 30px 0;">
                  <p style="font-size: 12px; color: #888;">This is an automated message from Drasta Security Team.</p>
                </div>
              </body>
            </html>
        """.formatted(fullName, ipAddress, browser, os, deviceType,
                    acceptLanguage != null ? acceptLanguage : "Unknown",
                    referer != null ? referer : "Not available",
                    formattedDate);

            helper.setText(html, true);
            mailSender.send(message);

        } catch (Exception e) {
            System.err.println("Failed to send login alert: " + e.getMessage());
        }
    }

    private String extractClientIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        } else {
            // X-Forwarded-For might contain multiple IPs
            ip = ip.split(",")[0];
        }
        return ip;
    }




}

