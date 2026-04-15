import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import axios from "axios";


const ContactPage = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    message: "",
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/contact", formData);
      alert(res.data.message);
  
      // reset form
      setFormData({
        name: "",
        email: "",
        number: "",
        message: "",
      });
  
    } catch (err) {
      alert("Something went wrong");
    }
  };


  return (
    <div className="min-h-screen pt-20 lg:pt-24">
      <div className="container mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <p className="mb-2 font-heading text-xs font-semibold uppercase tracking-widest text-primary">✦ Get In Touch</p>
          <h1 className="font-display text-3xl font-bold tracking-wider lg:text-5xl">CONTACT US</h1>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3"><Mail className="h-5 w-5 text-primary" /></div>
              <div>
                <h3 className="font-heading text-sm font-semibold">Email</h3>
                <p className="text-sm text-muted-foreground">support@an1meparadise.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3"><Phone className="h-5 w-5 text-primary" /></div>
              <div>
                <h3 className="font-heading text-sm font-semibold">Phone</h3>
                <p className="text-sm text-muted-foreground">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3"><MapPin className="h-5 w-5 text-primary" /></div>
              <div>
                <h3 className="font-heading text-sm font-semibold">Location</h3>
                <p className="text-sm text-muted-foreground">Mumbai, Maharashtra, India</p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            {/* <input placeholder="Your Name" className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
            <input placeholder="Your Email" className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
            <input placeholder="Subject" className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
            <textarea placeholder="Your Message" rows={5} className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:border-primary focus:outline-none" /> */}
            
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:border-primary focus:outline-none"  />
            <input name="number" value={formData.number} onChange={handleChange} placeholder="Number" className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message" rows={5} className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:border-primary focus:outline-none" />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="w-full rounded-xl bg-gradient-neon py-4 font-heading text-sm font-bold uppercase tracking-wider text-primary-foreground"
              onClick={handleSubmit}
            >
              Send Message
            </motion.button>

           

          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
