"use client";
import { motion } from "framer-motion";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

const staggerRows = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.25,
        },
    },
};

export default function ComparisonSection() {
    return (
        <section className="w-full py-20 bg-white text-gray-800">
            <div className="max-w-6xl mx-auto px-4">
                {/* Pill above heading */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="flex justify-center mb-4"
                >
                    <span className="px-4 py-1 rounded-full bg-[#FFE4DF] text-[#FC4321] text-sm font-medium">
                        Why choose Privacure
                    </span>
                </motion.div>

                {/* Header */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="text-3xl font-bold mb-2 text-center"
                >
                    What makes Privacure{" "}
                    <span className="text-red-600">different</span>
                </motion.h2>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="text-gray-500 text-center max-w-2xl mx-auto mb-12"
                >
                    While others offer generic solutions, Privacure is purpose-built for the African healthcare ecosystem, combining global best practices with local expertise.
                </motion.p>

                {/* Features Grid */}
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ amount: 0.2 }}
                    variants={staggerRows}
                    className="grid md:grid-cols-2 gap-10 mb-20"
                >
                    {[
                        {
                            title: "Compliance-first Design",
                            desc: "Built from the ground up with HIPAA and GDPR compliance, ensuring patient data protection meets International standards.",
                        },
                        {
                            title: "AI-driven Health Exchange",
                            desc: "Advanced machine learning algorithms optimize data sharing, detect anomalies, and provide intelligent health insights.",
                        },
                        {
                            title: "African Healthcare Reality",
                            desc: "Specifically designed for Africa's unique challenges,low infrastructure, diverse systems, and fragmented records.",
                        },
                        {
                            title: "Patient Trust & Hospital Efficiency",
                            desc: "Unique dual focus on building patient confidence while maximizing operational efficiency for healthcare providers.",
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            variants={fadeInUp}
                            className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition bg-gray-50 flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm">{item.desc}</p>
                            </div>

                            {/* This line now shows on ALL cards */}
                            {/* <p className="mt-4 text-sm font-semibold">
                                <span className="text-[#FC4321]">100%</span> Compliance Ready
                            </p> */}

                            {["Internationally Compliant",
                                "AI-Powered accuracy",
                                "Locally Relevant",
                                "Patient-Centered",]
                            [i] && (
                                    <p className="mt-4 text-sm font-semibold"><span className="text-[#FC4321]">100%</span> {""} {["Internationally Compliant",
                                        "AI-Powered accuracy",
                                        "Locally Relevant",
                                        "Patient-Centered",]
                                    [i]}</p>
                                )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* Comparison Table */}
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ amount: 0.2 }}
                    variants={fadeInUp}
                    className="overflow-x-auto"
                >
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="p-4">Feature</th>
                                <th className="p-4 text-[#191279]">Privacure</th>
                                <th className="p-4">Traditional EMRs</th>
                                <th className="p-4">Generic Platforms</th>
                            </tr>
                        </thead>

                        <motion.tbody
                            variants={staggerRows}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ amount: 0.3 }}
                        >
                            {[
                                ["African Healthcare Focus", "✔", "✖", "✖"],
                                ["AI-Powered Interoperability", "✔", "Limited", "Basic"],
                                ["Compliance-First Design", "✔", "Varies", "Add-on"],
                                ["Low-Bandwidth Optimization", "✔", "✖", "✖"],
                            ].map((row, i) => (
                                <motion.tr
                                    key={i}
                                    variants={fadeInUp}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    {row.map((cell, j) => {
                                        let cellClass = "p-4 text-sm";
                                        if (cell === "✔") cellClass += " text-green-600";
                                        if (cell === "✖") cellClass += " text-red-500";
                                        if (
                                            ["Limited", "Varies", "Basic", "Add-on"].includes(cell)
                                        )
                                            cellClass += " text-yellow-400";

                                        return (
                                            <td key={j} className={cellClass}>
                                                {cell}
                                            </td>
                                        );
                                    })}
                                </motion.tr>
                            ))}
                        </motion.tbody>
                    </table>
                </motion.div>
            </div>
        </section>
    );
}