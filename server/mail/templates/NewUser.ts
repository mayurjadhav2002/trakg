export const newUserTemplate = (name: string, trialdays: string): string => {
	return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to Trakg</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f7;
      color: #333333;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
    }

    .header {
      background-color: #4f46e5;
      padding: 24px;
      text-align: center;
      color: #ffffff;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
    }

    .content {
      padding: 30px;
      font-size: 16px;
      line-height: 1.6;
    }

    .btn {
      display: inline-block;
      padding: 14px 24px;
      background-color: #4f46e5;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin-top: 20px;
    }

    .image-container {
      text-align: center;
      padding: 0 30px 30px;
    }

    .image-container img {
      max-width: 100%;
      border-radius: 8px;
    }

    .footer {
      text-align: center;
      padding: 20px;
      font-size: 14px;
      color: #999999;
      background-color: #f9f9fb;
    }

    .social-icons {
      padding: 10px 0;
    }

    .social-icons a {
      display: inline-block;
      margin: 0 8px;
    }

    .social-icons img {
      width: 24px;
      height: 24px;
    }

    @media screen and (max-width: 600px) {
      .content, .image-container {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Trakg!</h1>
    </div>

    <div class="content">
      <p>Hi <strong>${name}</strong>,</p>

      <p>Thanks for signing up! 🎉 You're now part of a growing community focused on turning form abandonments into conversions.</p>

      <p>With your ${trialdays}-day free trial, you can:</p>
      <ul>
        <li>Track how users interact with your forms</li>
        <li>Capture partial submissions</li>
        <li>Recover leads in real-time</li>
        <li>Analyze forms and fields</li>
        <li>Understand your traffic and pain points</li>
      </ul>

      <p>Let’s get you set up and tracking in just a few clicks:</p>

      <a class="btn" href="https://app.trakg.com/dashboard" target="_blank">Go to Dashboard</a>

      <p>Need help? Reach out anytime at <a href="mailto:support@trakg.com">support@trakg.com</a></p>

      <p>— Team Trakg</p>
    </div>

    <div class="image-container">
      <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExejltc253N214czltbG9tYXJzNHVoNGJ6cGZoZmh4MmpyMGx2amlkZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ASd0Ukj0y3qMM/giphy.gif" alt="Trakg Dashboard Preview" />
    </div>

    <div class="footer">
<p>Show us some love — let’s follow each other!</p>

 <div class="social-icons">
      <a href="https://www.instagram.com/trakg.com_/" target="_blank">
          <img src="https://www.svgrepo.com/show/452196/facebook-1.svg" alt="Facebook" />
        </a>
        <a href="https://www.instagram.com/trakg.com_/" target="_blank">
          <img src="https://www.svgrepo.com/show/452229/instagram-1.svg" alt="Instagram" />
        </a>
        <a href="https://x.com/trakg_x" target="_blank">
                  <img src="https://www.svgrepo.com/show/475689/twitter-color.svg" alt="YouTube" />

        </a>
        <a href="https://www.youtube.com/channel/UCUJTidjI455mqWgMkLxLKKQ" target="_blank">
          <img src="https://www.svgrepo.com/show/452138/youtube.svg" alt="YouTube" />
        </a>
        <a href="https://www.linkedin.com/company/trakg-com" target="_blank">
          <img src="https://www.svgrepo.com/show/452047/linkedin-1.svg" alt="LinkedIn" />
        </a>
       
      </div>
      <p>© 2025 Trakg. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
};

export const TrialPeriodStarted = ({
	days,
	name,
	enddate,
}: {
	days: string;
	name: string;
	enddate: string;
}) => {
	return `
  <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to Trakg!</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f7;
      color: #333333;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
    }

    .header {
      background-color: #4f46e5;
      padding: 20px;
      display: flex;
      justify-content: center;
      gap: 10px;
      
      text-align: center;
      color: #ffffff;
    }

    .header img {
      max-height: 40px;
      border-radius: 15px;
      margin-bottom: 15px;
    }

    .header h1 {
      font-size: 24px;
      margin: 0;
    }

    .content {
      padding: 30px;
      font-size: 16px;
      line-height: 1.6;
    }

    .content h2 {
      font-size: 20px;
      color: #4f46e5;
      margin-top: 0;
    }

    .btn {
      display: inline-block;
      padding: 14px 24px;
      background-color: #4f46e5;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin-top: 20px;
    }

    .image-container {
      text-align: center;
      padding: 0 30px 30px;
    }

    .image-container img {
      max-width: 100%;
      border-radius: 8px;
    }

    .footer {
      text-align: center;
      padding: 20px;
      font-size: 14px;
      color: #999999;
    }

    a {
      color: #4f46e5;
    }

    @media screen and (max-width: 600px) {
      .content, .header, .image-container {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
  
    <div class="content">
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your <strong>${days}-day free trial</strong> is now active! You now have full access to explore all of Trakg's powerful features — track form behavior, uncover drop-offs, and recover leads in real time.</p>

      <p><strong>Your trial ends on ${enddate}</strong>, so let’s make the most of it!</p>

      <a class="btn" href="https://app.trakg.com/dashboard" target="_blank">Go to Dashboard</a>

      <p>Need help getting started? Feel free to reach out at <a href="mailto:support@trakg.com">support@trakg.com</a>.</p>

      <p>Happy tracking!<br>— The Trakg Team</p>
    </div>
    <div class="image-container">
      <img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjh3MzA2ZTVobmdnczIycnR3YjY0dGEzY296cmNvYTR4MTN0MHFpdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/o6cTitmMm9Vi1x4FmP/giphy.gif" alt="Dashboard Preview" />
    </div>
    <div class="footer">
      © 2025 Trakg. All rights reserved.
    </div>
  </div>
</body>
</html>

  `;
};

export const trialPeriodEndSoon = ({
	name,
	enddate,
	daysRemaining,
}: {
	name: string;
	enddate: string;
	daysRemaining: number;
}) => {
	return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Trial Ending Soon – Trakg</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f7;
      color: #333333;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
    }

    .content {
      padding: 30px;
      font-size: 16px;
      line-height: 1.6;
    }

    .content h2 {
      font-size: 20px;
      color: #4f46e5;
      margin-top: 0;
    }

    .btn {
      display: inline-block;
      padding: 14px 24px;
      background-color: #4f46e5;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin-top: 20px;
    }

    .image-container {
      text-align: center;
      padding: 0 30px 30px;
    }

    .image-container img {
      max-width: 100%;
      border-radius: 8px;
    }

    .footer {
      text-align: center;
      padding: 20px;
      font-size: 14px;
      color: #999999;
      background-color: #f9f9fb;
    }

    .social-icons {
      padding: 10px 0;
    }

    .social-icons a {
      display: inline-block;
      margin: 0 8px;
    }

    .social-icons img,
    .social-icons svg {
      width: 24px;
      height: 24px;
    }

    a {
      color: #4f46e5;
    }

    @media screen and (max-width: 600px) {
      .content, .image-container {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <p>Hi <strong>${name}</strong>,</p>

     <p>Just a heads-up — your free trial will end in <strong>${daysRemaining} ${
		daysRemaining === 1 ? "day" : "days"
	}</strong> on <strong>${enddate}</strong>.</p>


      <p>Upgrade now to keep capturing leads, analyzing drop-offs, and boosting your conversions without interruption.</p>

      <a class="btn" href="https://app.trakg.com/dashboard/settings/billing" target="_blank">Upgrade the plan</a>

      <p>Need help choosing the right plan? We’re here to assist.</p>

      <p>Is trakg helping you? Follow us on social media</p>
      <div class="social-icons">
    <a href="https://www.instagram.com/trakg.com_/" target="_blank">
          <img src="https://www.svgrepo.com/show/452196/facebook-1.svg" alt="Facebook" />
        </a>
        <a href="https://www.instagram.com/trakg.com_/" target="_blank">
          <img src="https://www.svgrepo.com/show/452229/instagram-1.svg" alt="Instagram" />
        </a>
        <a href="https://x.com/trakg_x" target="_blank">
<img src="https://www.svgrepo.com/show/475689/twitter-color.svg" alt="YouTube" />
        </a>
        <a href="https://www.youtube.com/channel/UCUJTidjI455mqWgMkLxLKKQ" target="_blank">
          <img src="https://www.svgrepo.com/show/452138/youtube.svg" alt="YouTube" />
        </a>
        <a href="https://www.linkedin.com/company/trakg-com" target="_blank">
          <img src="https://www.svgrepo.com/show/452047/linkedin-1.svg" alt="LinkedIn" />
        </a>
       
      </div>
            <p>— The Trakg Support Team</p>

    </div>

  
    <div class="image-container">
      <img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWRlbTV0MHUwMXk0YmhjODRmYWdoNXMwMmhpNGZ5NGwyazk1dDR0ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LnoY34a2mcGm3J5XEw/giphy.gif" alt="Dashboard Preview" />
    </div>

    <div class="footer">
    
      <p>© 2025 Trakg. All rights reserved.</p>
    </div>
  </div>
</body>
</html>

`;
};
