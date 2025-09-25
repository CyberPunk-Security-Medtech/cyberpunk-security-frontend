"use client";

import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

interface FooterProps { }

const Footer: React.FC<FooterProps> = () => {
    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    };

    const buttonVariants: Variants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
        hover: { scale: 1.02, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", transition: { duration: 0.2 } },
    };

    const logoVariants: Variants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
    };

    return (
        <motion.footer
            className="bg-[#101828] text-white py-16 px-6 relative overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
        >
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:justify-between md:space-x-12">
                    <motion.div
                        className="flex flex-col items-start space-y-6 md:col-span-2 max-w-lg"
                        variants={itemVariants}
                    >
                        <motion.div className="flex items-center space-x-3" variants={logoVariants}>
                            <div className="w-12 h-12 relative">
                                <Image src="/auth_logo.svg" alt="Privacure Logo" fill style={{ objectFit: "contain" }} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Privacure</h3>
                        </motion.div>

                        <motion.div className="text-sm text-gray-300 leading-relaxed" variants={itemVariants}>
                            <p>Building Africa's most trusted healthcare data infrastructure.</p>
                            <p>
                                Secure, compliant, and AI-powered interoperability for hospitals,
                                HMOs, and healthcare providers across the continent.
                            </p>
                        </motion.div>

                        <motion.div className="space-y-2 text-sm text-gray-300" variants={itemVariants}>
                            <div className="flex items-center space-x-2">
                                <span>📍</span>
                                <span>Lagos, Nigeria.</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>📧</span>
                                <a href="mailto:privacuremedtech@gmail.com" className="text-gray-300 hover:text-white transition-colors duration-200">Email us</a>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Product Section */}
                    <motion.div variants={itemVariants}>
                        <h4 className="text-lg font-semibold text-white mb-1 mt-3">Product</h4>
                        <div className="space-y-2">
                            {["Features", "Security", "Integrations", "API Documentation", "Pricing"].map((label) => (
                                <motion.a
                                    key={label}
                                    href="#"
                                    className="block text-sm text-gray-300 hover:text-white transition-colors duration-200"
                                    whileHover={{ x: 4 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {label}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Company Section */}

                    <motion.div variants={itemVariants}>
                        <h4 className="text-lg font-semibold text-white mb-1 mt-3">Company</h4>
                        <div className="space-y-2">
                            {["About Us", "Careers", "Press", "Blog", "Contact"].map((label) => (
                                <motion.a
                                    key={label}
                                    href="#"
                                    className="block text-sm text-gray-300 hover:text-white transition-colors duration-200"
                                    whileHover={{ x: 4 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {label}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Resources Section */}
                    <motion.div variants={itemVariants}>
                        <h4 className="text-lg font-semibold text-white mb-1 mt-3">Resources</h4>
                        <div className="space-y-2">
                            {["Case Studies", "White Papers", "Webinars", "Help Center", "Community"].map((label) => (
                                <motion.a
                                    key={label}
                                    href="#"
                                    className="block text-sm text-gray-300 hover:text-white transition-colors duration-200"
                                    whileHover={{ x: 4 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {label}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Legal Section */}
                    <motion.div variants={itemVariants}>
                        <h4 className="text-lg font-semibold text-white mb-1 mt-3">Legal</h4>
                        <div className="space-y-2">
                            {["Privacy Policy", "Terms of Service", "Compliance", "Security"].map((label) => (
                                <motion.a
                                    key={label}
                                    href="#"
                                    className="block text-sm text-gray-300 hover:text-white transition-colors duration-200"
                                    whileHover={{ x: 4 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {label}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Newsletter Signup */}
                <motion.div className="mt-16" variants={itemVariants}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-gray-300 max-w-lg mb-4 sm:mb-0">
                            <p className="font-medium">Stay Updated</p>
                            <p>
                                Get the latest updates on Privacure's development and African
                                healthcare innovation.
                            </p>
                        </div>

                        <motion.div
                            className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"
                            variants={buttonVariants}
                            whileHover="hover"
                        >
                            <input
                                type="email"
                                placeholder="Enter your mail"
                                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent w-full sm:w-64 text-sm"
                            />
                            <motion.button
                                type="button"
                                className="px-6 py-2 bg-white text-gray-900 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap text-sm"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Subscribe
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.footer>
    );
};

export default Footer;