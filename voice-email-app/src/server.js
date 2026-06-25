const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !text) {
    return res.status(400).json({ error: '送信先アドレスとテキストが必要です' });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: subject || '音声入力メモ',
      text,
    });
    res.json({ success: true });
  } catch (err) {
    console.error('メール送信エラー:', err.message);
    res.status(500).json({ error: 'メール送信に失敗しました: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`サーバー起動: http://localhost:${PORT}`);
});
