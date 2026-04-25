import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Linkedin, Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import profilePic from "../attached_assets/Vijit_github_profile_pic.jpg";

const ContactSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const { toast } = useToast();

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'service_04u7p7o',
          template_id: 'template_5ho84in',
          user_id: 'hlRl3biui9VIyL2Us',
          template_params: {
            name: formData.name,
            email: formData.email,
            message: formData.message,
            time: new Date().toLocaleString()
          }
        })
      });

      if (response.ok) {
        toast({ title: "Message Sent Successfully!", description: "I will review this and get back to you shortly.", duration: 4000 });
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast({ title: "Error", description: "Something went wrong sending the message.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to reach the mail server.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0 },
    visible: (i: number) => ({
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.1 * i + 0.3,
      },
    }),
  };

  const phoneIconVariants = {
    hidden: { scale: 0, rotate: -20 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
        delay: 0.5,
      },
    },
  };

  return (
    <section id="contact" className="w-full mx-auto items-center justify-center py-12 pt-12 bg-gray-900/50" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2
            className="text-3xl font-bold mb-4 text-center text-cyan-500 uppercase tracking-wider contact-title"
            variants={itemVariants}
          >
            CONTACT
          </motion.h2>
          <motion.p
            className="text-xl text-center mb-12"
            variants={itemVariants}
          >
            Connect With Me
          </motion.p>

          <motion.div variants={cardVariants}>
            <Card className="bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700 shadow-cyan-500/5 max-w-4xl mx-auto">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Contact Image */}
                  <motion.div
                    className="w-full md:w-1/2"
                    initial={{ opacity: 0, x: -50 }}
                    animate={
                      isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
                    }
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <div className="w-full h-64 md:h-auto bg-gradient-to-r from-cyan-600 to-purple-700 rounded-lg shadow-xl shadow-purple-500/10 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0, rotate: 15 }}
                        animate={
                          isInView
                            ? { scale: 1, rotate: 0 }
                            : { scale: 0, rotate: 15 }
                        }
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                          delay: 0.3,
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="w-24 h-24 text-white opacity-80"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
                        </svg>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Contact Info */}
                  <motion.div
                    className="w-full md:w-1/2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={
                      isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }
                    }
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  >
                    <div className="flex items-center space-x-4 mb-6">
                      <motion.div
                        className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 overflow-hidden flex items-center justify-center shadow-lg shadow-purple-500/20"
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : { scale: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: 0.4,
                        }}
                      >
                        <img
                          src={profilePic}
                          alt="Vijit Mehrotra"
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      <div>
                        {/* Live Status indicator */}
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                          </span>
                          <span className="text-xs text-green-400 font-medium uppercase tracking-wider">Available for roles</span>
                        </div>
                        <h3 className="text-xl font-semibold">
                          Vijit Mehrotra
                        </h3>
                        <p className="text-gray-400">
                          Generative AI Specialist
                        </p>
                      </div>
                    </div>

                    <motion.form 
                      onSubmit={handleFormSubmit}
                      className="space-y-4 mb-6 mt-4"
                      variants={itemVariants}
                    >
                      <div className="space-y-1">
                        <input
                          required
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          type="text"
                          placeholder="Your Name"
                          className="w-full bg-gray-900/50 border border-gray-700 rounded-md px-4 py-2 text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <input
                          required
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          type="email"
                          placeholder="Your Work Email"
                          className="w-full bg-gray-900/50 border border-gray-700 rounded-md px-4 py-2 text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <textarea
                          required
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="How can I help you?"
                          rows={3}
                          className="w-full bg-gray-900/50 border border-gray-700 rounded-md px-4 py-2 text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-500 resize-none"
                        />
                      </div>
                      
                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium transition-all duration-300 shadow-lg shadow-cyan-500/20 w-full"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </span>
                        ) : "Send Secure Message"}
                      </Button>
                    </motion.form>

                    {/* Social Media Icons */}
                    <TooltipProvider delayDuration={200}>
                      <div className="flex space-x-4">
                        {/* Phone */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.button
                              onClick={() => {
                                navigator.clipboard.writeText("+919620833271").then(() => {
                                  toast({
                                    title: "Phone Number Copied",
                                    description: "Ready to paste! (+91 9620833271)",
                                    duration: 3000,
                                  });
                                });
                              }}
                              className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                              custom={0}
                              variants={iconVariants}
                              whileHover={{ y: -5 }}
                              aria-label="Phone: +91 9620833271"
                            >
                              <Phone className="w-5 h-5 text-white" />
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 border-gray-700 text-cyan-400">
                            <p>Copy Phone Number</p>
                          </TooltipContent>
                        </Tooltip>

                        {/* Email */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.button
                              onClick={() => {
                                navigator.clipboard.writeText("vijitmehrotra95@gmail.com").then(() => {
                                  toast({
                                    title: "Email Address Copied",
                                    description: "Ready to paste! (vijitmehrotra95@gmail.com)",
                                    duration: 3000,
                                  });
                                });
                              }}
                              className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                              custom={1}
                              variants={iconVariants}
                              whileHover={{ y: -5 }}
                              aria-label="Email: vijitmehrotra95@gmail.com"
                            >
                              <Mail className="w-5 h-5 text-white" />
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 border-gray-700 text-cyan-400">
                            <p>Copy Email Address</p>
                          </TooltipContent>
                        </Tooltip>

                        {/* LinkedIn */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.button
                              onClick={() => {
                                window.open(
                                  "https://www.linkedin.com/in/vijit-mehrotra-018988130/",
                                  "_blank",
                                  "noopener,noreferrer"
                                );
                              }}
                              className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                              custom={2}
                              variants={iconVariants}
                              whileHover={{ y: -5 }}
                              aria-label="LinkedIn Profile"
                            >
                              <Linkedin className="w-5 h-5 text-white" />
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 border-gray-700 text-cyan-400">
                            <p>Visit LinkedIn Profile</p>
                          </TooltipContent>
                        </Tooltip>

                        {/* GitHub */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.button
                              onClick={() => {
                                window.open(
                                  "https://github.com/vijitVM",
                                  "_blank",
                                  "noopener,noreferrer"
                                );
                              }}
                              className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                              custom={3}
                              variants={iconVariants}
                              whileHover={{ y: -5 }}
                              aria-label="GitHub Profile"
                            >
                              <Github className="w-5 h-5 text-white" />
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 border-gray-700 text-cyan-400">
                            <p>Visit GitHub Profile</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
