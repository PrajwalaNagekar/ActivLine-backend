// export const sendOTPEmail = async ({ to, otp, purpose = "Profile Update" }) => {
//   try {
//     await transporter.sendMail({
//       from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_USER}>`,
//       to,
//       subject: `${purpose} OTP Verification`,
//       html: `
//         <div style="font-family: Arial; padding: 12px">
//           <h2>${purpose}</h2>
//           <p>Your OTP is:</p>
//           <h1 style="color:#2563eb">${otp}</h1>
//           <p>This OTP is valid for <b>5 minutes</b>.</p>
//           <p>If you didn’t request this, ignore this email.</p>
//           <br/>
//           <small>– ActivLine Support</small>
//         </div>
//       `,
//     });
//   } catch (error) {
//     console.error("❌ Mail send failed:", error.message);
//     throw new ApiError(500, "Failed to send OTP email");
//   }
// };
