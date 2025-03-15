import { motion } from 'framer-motion';

export default function StatCard({ title, value, icon, color = 'indigo' }) {
    const getGradient = () => {
        const gradients = {
            indigo: 'from-indigo-500/10 to-indigo-600/5',
            violet: 'from-violet-500/10 to-violet-600/5',
            purple: 'from-purple-500/10 to-purple-600/5',
            fuchsia: 'from-fuchsia-500/10 to-fuchsia-600/5',
            cyan: 'from-cyan-500/10 to-cyan-600/5',
            teal: 'from-teal-500/10 to-teal-600/5',
        };
        return gradients[color] || gradients.indigo;
    };

    const getBorderColor = () => {
        const borders = {
            indigo: 'border-indigo-500/20',
            violet: 'border-violet-500/20',
            purple: 'border-purple-500/20',
            fuchsia: 'border-fuchsia-500/20',
            cyan: 'border-cyan-500/20',
            teal: 'border-teal-500/20',
        };
        return borders[color] || borders.indigo;
    };

    const getIconColor = () => {
        const colors = {
            indigo: 'text-indigo-400',
            violet: 'text-violet-400',
            purple: 'text-purple-400',
            fuchsia: 'text-fuchsia-400',
            cyan: 'text-cyan-400',
            teal: 'text-teal-400',
        };
        return colors[color] || colors.indigo;
    };

    const getHighlightColor = () => {
        const highlights = {
            indigo: 'bg-indigo-500/10',
            violet: 'bg-violet-500/10',
            purple: 'bg-purple-500/10',
            fuchsia: 'bg-fuchsia-500/10',
            cyan: 'bg-cyan-500/10',
            teal: 'bg-teal-500/10',
        };
        return highlights[color] || highlights.indigo;
    };

    return (
        <div 
            className={`bg-gradient-to-br ${getGradient()} backdrop-blur-md rounded-xl p-5 border ${getBorderColor()} shadow-lg relative overflow-hidden hover:-translate-y-1 transition-transform`}
        >
            <div className="absolute top-0 right-0 w-16 h-16 -mt-6 -mr-6 rounded-full bg-gradient-to-br from-white/5 to-white/10 blur-2xl"></div>
            
            <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${getHighlightColor()} flex items-center justify-center ${getIconColor()}`}>
                    {icon}
                </div>
            </div>
            
            <h3 className="text-sm font-medium text-white/60">{title}</h3>
            <p className="text-3xl font-bold mt-1 text-white">{value}</p>
            
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>
    );
} 