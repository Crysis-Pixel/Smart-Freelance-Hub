// controllers/otpController.js
const sendgrid = require('@sendgrid/mail');

// Configure SendGrid
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);  // Store API key in .env


// Send OTP function
exports.mailMessage = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const websitelink = "http://localhost:5173/";
    // Send OTP email
    const msg = {
        to: email,
        from: 'smartfreelancehub@gmail.com', // Your verified SendGrid sender
        subject: 'New Job Alert',
        html: `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Job Notification</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f6f9;
                        margin: 0;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                        padding: 30px;
                        color: #333;
                    }
                    h1 {
                        font-size: 24px;
                        color: #333;
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    p {
                        font-size: 16px;
                        color: #555;
                        line-height: 1.6;
                        margin: 10px 0;
                    }
                    .highlight {
                        color: #007bff;
                        font-weight: bold;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 30px;
                        font-size: 12px;
                        color: #aaa;
                        border-top: 1px solid #ddd;
                        padding-top: 10px;
                    }
                    .button {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 12px 20px;
                        color: #fff;
                        background-color: #007bff;
                        border-radius: 5px;
                        text-align: center;
                        text-decoration: none;
                        font-size: 16px;
                        font-weight: bold;
                    }
                    .button:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🎉 New Job Notification!</h1>
                    <p>Dear <span class="highlight">User</span>,</p>
                    <p>You have received a new job on the <span class="highlight">Smart Freelance Hub</span> platform.</p>
                    <p>Please click the button below to view the job details and get started.</p>
                    
                    <a href="${websitelink}" class="button">View Job Details</a>
                    
                    <p>Thank you for being a valuable part of our community!</p>
                    <div class="footer">
                        <p>If you received this email by mistake, please ignore it.</p>
                    </div>
                </div>
            </body>
            </html>
    `,
    };

    try {
        await sendgrid.send(msg);
        res.status(200).json({ message: 'Mail sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send mail' });
    }
};