"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import FloatingSvgs from "../components/FloatingSVG";

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-100 via-indigo-100 to-white overflow-hidden transition-colors duration-300 relative">
        <FloatingSvgs />
        <div className="container mx-auto px-4 pt-44 pb-12 relative z-20 flex-grow">
          <div className="text-center max-w-6xl mx-auto py-12">
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-8 text-black"
              style={{ fontFamily: "'Syne', sans-serif" }}
              aria-label="Create Next-Level Graphics with The AI Design Studio"
              initial={{ opacity: 0, y: -30 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <div>The AI Design Studio</div>
              <div>
                for{" "}
                <span className="bg-gradient-to-r from-purple-500 to-indigo-600 text-transparent bg-clip-text">
                  Graphic Designers
                </span>
              </div>
            </motion.h1>
            <motion.p
              className="text-gray-600 text-lg md:text-xl mb-12"
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              Crafted to make you <strong>faster</strong> and more{" "}
              <strong>creative</strong>.
              <br />
              AI studio for graphic designers, entrepreneurs, and influencers.
            </motion.p>
            <motion.div
              className="flex justify-center mb-4"
              initial={{ opacity: 0, y: 0, scale: 0 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/#Home">
                <div
                  className="inline-block rounded-lg shadow-lg transition-all duration-300 group"
                  style={{
                    boxShadow: "rgba(124, 58, 237, 0.4) 0px 0px 20px",
                  }}
                >
                  <button className="relative bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-8 rounded-lg font-medium text-lg flex items-center justify-center transition-all duration-300 hover:scale-105 hover:rounded-xl overflow-hidden group-hover:shadow-2xl">
                    Start For Free
                    <span className="ml-2 flex items-center">
                      <ArrowRight className="h-5 w-5 animate-bounce-right" />
                    </span>
                    <span className="absolute inset-0 bg-blue-200 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"></span>
                  </button>
                </div>
              </Link>
            </motion.div>
            <motion.p
              className="text-gray-500 text-sm mt-2"
              initial={{ opacity: 0, y: 0, scale: 0 }} 
              animate={{ opacity: 1, y: 0 , scale: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
            >
              No Credit Card Required
            </motion.p>
          </div>
        </div>
      </div>
    </>
  );
}