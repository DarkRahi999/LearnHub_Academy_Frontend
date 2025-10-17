"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PhoneForwarded } from "lucide-react";

const DraggableWhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Button is always visible and positioned at bottom right
      setIsVisible(true);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = () => {
    // Open WhatsApp
    window.open("https://wa.me/8801729249260", "_blank");
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed bottom-5 right-5 z-50 bg-red-500 text-white rounded-full p-4 shadow-lg hover:bg-red-600 transition-all duration-300 select-none cursor-pointer"
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* WhatsApp Icon */}
      <PhoneForwarded className="w-6 h-6" />
    </motion.div>
  );
};

export default DraggableWhatsAppButton;