export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, project, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Please fill in all required fields." });
  }

  try {
 const response = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    "Content-Type": "application/json",
    "User-Agent": "sophieelle-contact-form/1.0",
  },
      body: JSON.stringify({
        from: "Sophie Elle Website <hello@sophieelle.com>",
        to: ["hellosoffee@gmail.com"],
        reply_to: email,
        subject: `new website inquiry from ${name}`,
        html: `
          <h2>new inquiry from sophieelle.com</h2>

          <p><strong>name:</strong> ${name}</p>
          <p><strong>email:</strong> ${email}</p>
          <p><strong>inquiring about:</strong> ${project || "not specified"}</p>

          <p><strong>message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend error:", data);
      return res.status(500).json({ error: "oops, email could not be sent." });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({ error: "oops, something went wrong." });
  }
}
