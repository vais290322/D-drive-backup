import MailAccount from '../models/MailAccount.js';

// SMTP presets for known domains
const SMTP_PRESETS = {
  gmail: { host: 'smtp.gmail.com', port: 587, secure: false },
  hostinger: { host: 'smtp.hostinger.com', port: 465, secure: true },
  godaddy: { host: 'smtpout.secureserver.net', port: 465, secure: true },
};

// Simple base64 encoding for password obfuscation (not encryption – for critical apps use proper encryption)
const encodePassword = (plain) => Buffer.from(plain).toString('base64');
export const decodePassword = (encoded) => Buffer.from(encoded, 'base64').toString('utf8');

// ─── Get All Mail Accounts ────────────────────────────────────────────────────
export const getMailAccounts = async (req, res) => {
  try {
    const accounts = await MailAccount.find({ userId: req.user._id }).select('-encryptedPassword');
    return res.status(200).json({ success: true, accounts });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch mail accounts.', error: error.message });
  }
};

// ─── Add Mail Account ─────────────────────────────────────────────────────────
export const addMailAccount = async (req, res) => {
  try {
    const { label, domain, email, password, host, port, secure } = req.body;

    if (!label || !domain || !email || !password) {
      return res.status(400).json({ success: false, message: 'Label, domain, email, and password are required.' });
    }

    // Build SMTP config
    let smtpConfig;
    if (SMTP_PRESETS[domain]) {
      smtpConfig = SMTP_PRESETS[domain];
    } else {
      if (!host || !port) {
        return res.status(400).json({ success: false, message: 'Host and port are required for custom domain.' });
      }
      smtpConfig = { host, port: parseInt(port), secure: secure === true || secure === 'true' };
    }

    const account = await MailAccount.create({
      userId: req.user._id,
      label,
      domain,
      email,
      encryptedPassword: encodePassword(password),
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
    });

    return res.status(201).json({
      success: true,
      message: 'Mail account added.',
      account: {
        _id: account._id,
        label: account.label,
        domain: account.domain,
        email: account.email,
        host: account.host,
        port: account.port,
        secure: account.secure,
        createdAt: account.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add mail account.', error: error.message });
  }
};

// ─── Delete Mail Account ──────────────────────────────────────────────────────
export const deleteMailAccount = async (req, res) => {
  try {
    const account = await MailAccount.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!account) {
      return res.status(404).json({ success: false, message: 'Mail account not found.' });
    }

    return res.status(200).json({ success: true, message: 'Mail account deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete mail account.', error: error.message });
  }
};
