import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Linkedin, Github } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import profilePic from "../attached_assets/Vijit_github_profile_pic.jpg";

const ContactSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

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
    <section id="contact" className="py-20 bg-gray-900/50" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2
            className="text-3xl font-bold mb-4 text-center text-cyan-500 uppercase tracking-wider"
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
                        <h3 className="text-xl font-semibold">
                          Vijit Mehrotra
                        </h3>
                        <p className="text-gray-400">
                          Generative AI Specialist
                        </p>
                      </div>
                    </div>

                    <motion.p
                      className="text-gray-300 mb-6"
                      variants={itemVariants}
                    >
                      If you have any questions or inquiries, please don't
                      hesitate to reach out. For hiring inquiries, feel free to
                      contact me via email or phone.
                    </motion.p>

                    <motion.div
                      className="flex space-x-4 mb-6"
                      variants={itemVariants}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                      >
                        <Button 
                          className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium py-2 px-6 rounded-md transition-all duration-300 shadow-lg shadow-cyan-500/20 flex items-center justify-center w-full"
                          onClick={() => {
                            // Safer way than using mailto links directly
                            navigator.clipboard.writeText("vijitmehrotra95@gmail.com").then(() => {
                              alert("Email copied to clipboard: vijitmehrotra95@gmail.com");
                            });
                          }}
                        >
                          CONTACT
                        </Button>
                      </motion.div>
                    </motion.div>

                    {/* Social Media Icons */}
                    <div className="flex space-x-4">
                      <motion.button
                        onClick={() => {
                          // Phone number can be a security concern, using a button 
                          // with onClick handler instead of direct tel: link
                          navigator.clipboard.writeText("+919620833271").then(() => {
                            alert("Phone number copied to clipboard: +91 9620833271");
                          });
                        }}
                        className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                        custom={0}
                        variants={iconVariants}
                        whileHover={{ y: -5 }}
                        title="+91 9620833271"
                        aria-label="Phone: +91 9620833271"
                      >
                        <Phone className="w-5 h-5 text-white" />
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          // Email can be a security concern, using a button 
                          // with onClick handler instead of direct mailto: link
                          navigator.clipboard.writeText("vijitmehrotra95@gmail.com").then(() => {
                            alert("Email copied to clipboard: vijitmehrotra95@gmail.com");
                          });
                        }}
                        className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                        custom={1}
                        variants={iconVariants}
                        whileHover={{ y: -5 }}
                        title="vijitmehrotra95@gmail.com"
                        aria-label="Email: vijitmehrotra95@gmail.com"
                      >
                        <Mail className="w-5 h-5 text-white" />
                      </motion.button>
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
                        title="LinkedIn Profile"
                        aria-label="LinkedIn Profile"
                      >
                        <Linkedin className="w-5 h-5 text-white" />
                      </motion.button>
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
                        title="GitHub Profile"
                        aria-label="GitHub Profile"
                      >
                        <Github className="w-5 h-5 text-white" />
                      </motion.button>
                    </div>
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
