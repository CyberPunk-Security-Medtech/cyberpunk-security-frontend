"use client";

import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.18,
            delayChildren: 0.12,
        },
    },
};

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 22 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
};

const formChildrenStagger: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.16,
            delayChildren: 0.06,
        },
    },
};

export default function PurpleSignupCTA() {
    return (
        <section id="signup" className="relative bg-[#3F34D0] text-white py-20">
            <div className="max-w-6xl mx-auto px-6">
                {/* Top Section */}
                <div className="mx-auto max-w-5xl text-center mb-8">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ amount: 0.25 }}
                        variants={fadeInUp}
                        className="inline-block px-4 py-1 mb-4 text-sm rounded-full bg-white/10 backdrop-blur-sm"
                    >
                        Limited Early Access
                    </motion.div>

                    <motion.h2
                        initial="hidden"
                        whileInView="show"
                        viewport={{ amount: 0.25 }}
                        variants={fadeInUp}
                        className="text-3xl md:text-4xl font-bold leading-tight"
                    >
                        Be Among the First to Experience the{" "}
                        <span className="bg-clip-text text-transparent bg-green-300">
                            Future of Healthcare
                        </span>
                    </motion.h2>

                    <motion.p
                        initial="hidden"
                        whileInView="show"
                        viewport={{ amount: 0.25 }}
                        variants={fadeInUp}
                        className="text-blue-100 max-w-3xl mx-auto mt-4"
                    >
                        Privacure is currently in the MVP stage. We're inviting hospitals,
                        HMOs and clinics to join our early-access program and shape the
                        future of African healthcare interoperability.
                    </motion.p>
                </div>

                {/* Grid & Form */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ amount: 0.2 }}
                    className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {/* Card 1 */}
                    <motion.div
                        variants={fadeInUp}
                        className="p-6 rounded-2xl  bg-[#4A3FE0] text-white border border-white/20">
                        <h3 className="text-lg font-semibold mb-2">Early Access Benefits</h3>
                        <p className="text-sm text-white">
                            Early onboarding, priority support, and direct influence on product
                            features.
                        </p>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div
                        variants={fadeInUp}
                        className="p-6 rounded-2xl bg-[#4A3FE0] text-white border border-white/20"
                    >
                        <h3 className="text-lg font-semibold mb-2">Special Pricing</h3>
                        <p className="text-sm text-white">
                            Exclusive early-bird pricing and pilot packages for adopters.
                        </p>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div
                        variants={fadeInUp}
                        className="p-6 rounded-2xl bg-[#4A3FE0] text-white border border-white/20"
                    >
                        <h3 className="text-lg font-semibold mb-2">Community Access Pricing</h3>
                        <p className="text-sm text-white">
                            Tailored, affordable plans for community clinics and small providers.
                        </p>
                    </motion.div>

                    {/* Form (spans 3 columns) */}
                    <motion.div
                        variants={fadeInUp}
                        className="md:col-span-3 mt-2 rounded-2xl  bg-[#4A3FE0] text-white border border-white/20 p-8"
                    >
                        <div className="max-w-3xl mx-auto">
                            <motion.h4
                                variants={fadeInUp}
                                className="text-xl font-bold mb-4 text-center"
                            >
                                Join Our Waitlist
                            </motion.h4>

                            <motion.form
                                variants={formChildrenStagger}
                                className="grid grid-cols-1 gap-3"
                                onSubmit={(e) => e.preventDefault()}
                            >
                                <motion.input
                                    variants={fadeInUp}
                                    type="text"
                                    placeholder="Your name"
                                    className="w-full max-w-md mx-auto rounded-lg px-4 py-2  placeholder-white border border-white/20 bg-[#4A3FE0] focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />

                                <motion.input
                                    variants={fadeInUp}
                                    type="email"
                                    placeholder="Work email"
                                    className="w-full max-w-md mx-auto rounded-lg px-4 py-2 placeholder-white border border-white/20 bg-[#4A3FE0]  focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />

                                <motion.input
                                    variants={fadeInUp}
                                    type="text"
                                    placeholder="Organization name"
                                    className="w-full max-w-md mx-auto rounded-lg px-4 py-2 placeholder-white border border-white/20 bg-[#4A3FE0] focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />

                                <motion.select
                                    variants={fadeInUp}
                                    className="w-full max-w-md mx-auto rounded-lg px-4 py-2  bg-[#4A3FE0] border border-white/20 focus:outline-none focus:ring-2 placeholder-white focus:ring-indigo-400"
                                >
                                    <option value="">Organization size</option>
                                    <option>1-10</option>
                                    <option>11-50</option>
                                    <option>51-200</option>
                                    <option>201+</option>
                                </motion.select>

                                <motion.button
                                    variants={fadeInUp}
                                    type="submit"
                                    className="w-full max-w-md mx-auto py-2 rounded-lg bg-white text-indigo-800 font-semibold hover:bg-gray-200 transition"
                                >
                                    Join the Waitlist
                                </motion.button>
                            </motion.form>
                            <p className="text-white/80 text-xs text-center leading-relaxed mt-6 font-sm">We respect your privacy. Your information will only be used to contact you about Privacure updates</p>

                        </div>
                    </motion.div>
                    <motion.div
                        variants={fadeInUp}
                        className="md:col-span-3 mt-6 flex justify-center"
                    >
                        <div className="flex gap-4">
                            <button className="px-6 py-2 rounded-lg bg-white text-indigo-800 font-semibold hover:bg-gray-200 transition">
                                Request Demo
                            </button>
                            <button className="px-6 py-2 rounded-lg text-white border border-white font-semibold hover:bg-gray-200 transition">
                                Contact Our Team
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}