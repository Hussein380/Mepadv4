import { motion } from 'framer-motion';

export default function GridBackground() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden">
            {/* Grid Pattern */}
            <div 
                className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] 
                           bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"
                style={{ opacity: 0.1 }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-950/50 via-blue-900/50 to-blue-950/80" />

            {/* Animated Dots */}
            <div className="absolute inset-0 grid grid-cols-6 gap-4 p-4">
                {Array.from({ length: 24 }).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                            opacity: [0.2, 0.4, 0.2],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: i * 0.1,
                        }}
                        className="w-1 h-1 bg-blue-400/40 rounded-full"
                    />
                ))}
            </div>
        </div>
    );
} 