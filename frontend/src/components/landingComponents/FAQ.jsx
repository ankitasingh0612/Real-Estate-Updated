import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqData = [
        {
            question: "How can I track my order?",
            answer: "Go to the 'Order Tracking' section and enter your order ID to see the current status of your property transaction."
        },
        {
            question: "What payment methods are available?",
            answer: "We accept UPI, all major Debit/Credit Cards, and Net Banking for booking and payment installments."
        },
        {
            question: "When will the property be delivered?",
            answer: "Handover timelines depend on the project but are typically completed within 30-90 days after registration."
        },
        {
            question: "What is your refund policy?",
            answer: "Refunds on booking amounts are processed within 7-10 business days as per our standard cancellation policy."
        },
        {
            question: "How do I secure my account?",
            answer: "You can manage your profile settings and reset your password using the 'Forgot Password' link on the login page."
        }
    ];

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="faq-section py-5">
            <div className="container">
                <div className="text-center mb-5">
                    <span className="tagline">Common Questions</span>
                    <h2 className="section-title">Frequently Asked Questions</h2>
                </div>

                <div className="faq-container mx-auto" style={{ maxWidth: '800px' }}>
                    {faqData.map((item, index) => (
                        <div key={index} className="faq-item mb-3">
                            <button
                                className={`faq-question d-flex justify-content-between align-items-center w-100 py-3 px-4 ${activeIndex === index ? 'active' : ''}`}
                                onClick={() => toggleAccordion(index)}
                            >
                                <span className="fw-semibold text-start">{item.question}</span>
                                <motion.span
                                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <FaChevronDown className="faq-icon" />
                                </motion.span>
                            </button>

                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div className="faq-answer py-3 px-4">
                                            <p className="mb-0 text-muted">{item.answer}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
