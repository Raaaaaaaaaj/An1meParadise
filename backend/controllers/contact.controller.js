import { addContactMessage, getAllMessages, getMessageById, deleteMessage } from "../models/contact.model.js";
import nodemailer from "nodemailer";


// ✅ SUBMIT CONTACT FORM (SAVE + EMAIL)
export const submitContact = async (req, res) => {
  try {
    const { name, email, number, message } = req.body;

    // 🔍 validation
    if (!name || !email || !number || !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 🔥 Step 1: Save in DB
    const result = await addContactMessage([
      name,
      email,
      number,
      message,
    ]);

    // 🔥 Step 2: Send Email to Owner
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.MAIL_USER,
      number: `New Contact: ${number}`,
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>number:</b> ${number}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    res.json({
      message: "Message sent successfully",
      id: result.insertId,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ GET ALL MESSAGES (ADMIN PANEL)
export const fetchAllMessages = async (req, res) => {
  try {
    const data = await getAllMessages();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ GET SINGLE MESSAGE
export const fetchSingleMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await getMessageById(id);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ DELETE MESSAGE
export const removeMessage = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteMessage(id);

    res.json({
      message: "Message deleted",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};