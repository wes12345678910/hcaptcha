// api/verify.js
export default async function handler(request, response) {
    // Only allow POST requests
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const { token } = request.body;

    if (!token) {
        return response.status(400).json({ error: 'Missing CAPTCHA token' });
    }

    // PUT YOUR SECRET KEY HERE
    // (Using hCaptcha's free dummy testing secret key for now)
    const SECRET_KEY = "ES_0e580ef02a234f3aa27753afa5a6596d"; 

    try {
        // Talk server-to-server to hCaptcha (No CORS restriction here!)
        const hcaptchaResponse = await fetch('https://api.hcaptcha.com/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                secret: SECRET_KEY,
                response: token
            })
        });

        const data = await hcaptchaResponse.json();

        if (data.success) {
            return response.status(200).json({ success: true });
        } else {
            return response.status(400).json({ success: false, message: "Invalid CAPTCHA token" });
        }
    } catch (error) {
        return response.status(500).json({ success: false, message: "Server error" });
    }
}
