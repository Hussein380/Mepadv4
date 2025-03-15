import { motion } from 'framer-motion';

export default function LoadingSpinner() {
    return (
        <div className="flex flex-col justify-center items-center py-8">
            <div className="w-8 h-8 border-2 border-t-indigo-400 border-r-transparent border-b-violet-400 border-l-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-slate-400 text-sm">Loading...</p>
        </div>
    );
} 