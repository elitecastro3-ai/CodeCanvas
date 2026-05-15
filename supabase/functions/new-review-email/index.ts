import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {

  try {

    const data = await req.json();

    const review = data.record;

    const message = `
New Review Submitted ⭐

Name: ${review.name}
Business: ${review.business}
Rating: ${review.rating} Stars

Review:
${review.text}
`;

    // EMAIL NOTIFICATION USING RESEND
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "CodeCanvas <onboarding@resend.dev>",
        to: ["elijahenrique8@gmail.com"],
        subject: "New Review Received ⭐",
        text: message
      })
    });

    const emailResult = await emailResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        emailResult
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (error) {

    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500
      }
    );

  }

});