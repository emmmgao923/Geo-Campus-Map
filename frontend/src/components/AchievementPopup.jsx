import { motion, AnimatePresence } from "framer-motion";

export default function AchievementPopup({ achievement }) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="fixed bottom-8 right-8 bg-white/90 backdrop-blur-md border border-yellow-400 shadow-2xl rounded-2xl p-4 flex items-center gap-4 z-50"
        >
          <img
            src={`/assets/trophies/${achievement.icon}`} // e.g. "first_post.png"
            alt="trophy"
            className="w-16 h-16 animate-bounce"
          />
          <div>
            <p className="text-lg font-bold text-yellow-600">
              🎉 恭喜解锁新成就！
            </p>
            <p className="text-gray-800 font-semibold">{achievement.title}</p>
            <p className="text-gray-500 text-sm">{achievement.description}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
