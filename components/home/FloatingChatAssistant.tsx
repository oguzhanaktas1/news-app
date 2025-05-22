"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { X } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import NewsAssistant from "./NewsAssistant";

export default function FloatingChatAssistant() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence initial={false}>
        <motion.div
          key="chat-wrapper"
          initial={{ height: 48, width: 240, opacity: 0, y: 20 }}
          animate={
            open
              ? { height: 560, width: 320, opacity: 1, y: 0 }
              : { height: 48, width: 320, opacity: 1, y: 0 }
          }
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={clsx(
            "bg-blue-600 dark:bg-blue-700 shadow-lg flex flex-col",
            open ? "rounded-xl" : "rounded-xl"
          )}
        >
          <div
            onClick={() => setOpen(!open)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 cursor-pointer select-none rounded-t-xl"
            )}
            style={{ width: "100%" }}
          >
            <MessageCircle size={28} color="white" />
            <motion.span
              layout
              className="text-white font-medium whitespace-nowrap"
            >
              🧠 News AI Assistant
            </motion.span>

            {open && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
                className="ml-auto text-white hover:text-red-400 focus:outline-none"
                aria-label="Chat close"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                key="chat-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-900 flex-1 rounded-b-xl p-3 overflow-hidden"
                style={{ minHeight: "480px" }}
              >
                <NewsAssistant />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
