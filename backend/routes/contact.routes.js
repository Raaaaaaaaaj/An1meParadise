import express from "express";
import {
  submitContact,
  fetchAllMessages,
  fetchSingleMessage,
  removeMessage,
  // markMessageRead (optional future use)
} from "../controllers/contact.controller.js";

const router = express.Router();


// ✅ SUBMIT CONTACT FORM (USER SIDE)
router.post("/contact", submitContact);


// ✅ GET ALL MESSAGES (ADMIN)
router.get("/contact", fetchAllMessages);


// ✅ GET SINGLE MESSAGE
router.get("/contact/:id", fetchSingleMessage);


// ✅ DELETE MESSAGE
router.delete("/contact/:id", removeMessage);


// ✅ MARK AS READ (OPTIONAL - CRM FEATURE)
// router.put("/contact/read/:id", markMessageRead);


export default router;