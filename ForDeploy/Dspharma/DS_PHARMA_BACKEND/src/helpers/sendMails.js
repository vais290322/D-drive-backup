import { companyDetails } from '../config/credentials.js';
import { transporter } from '../config/nodemailer.js';
import registrationSuccessTemplate from '../templates/registrationSuccessTemplate.js';

export const sendRegistraionMail = async customerDetails => {
  try {
    const subject = 'Registration Successful - DS Pharma';
    const html = registrationSuccessTemplate({ customerDetails });

    const info = await transporter.sendMail({
      from: `"DS Pharma" <${companyDetails.email}>`,
      to: customerDetails.email1,
      subject,
      html,
    });

    return info;
  } catch (error) {
    throw error;
  }
};
