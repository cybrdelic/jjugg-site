import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
    Table,
    BarChart3,
    PieChart,
    LineChart,
    Search,
    Filter,
    SlidersHorizontal,
    CheckCircle,
    Briefcase,
    Calendar,
    Mail,
    FileCheck,
    Award,
    Star,
    ArrowUpRight
} from 'lucide-react';

export function HeroAnimation() {
    const { theme } = useTheme();
    const [currentScene, setCurrentScene] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            setCurrentScene((prev) => (prev + 1) % 3);
        }, 5000); // Change scene every 5 seconds

        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    const isDark = theme === 'dark';

    // Scene variants
    const sceneVariants = {
        initial: {
            opacity: 0,
            y: 20,
            scale: 0.95
        },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            scale: 0.95,
            transition: {
                duration: 0.3
            }
        }
    };

    const itemVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 }
    };

    return (
        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-black/90 backdrop-blur-lg shadow-2xl">
            <div className="flex items-center justify-start p-2 border-b border-slate-800/60">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs text-slate-400 mx-auto font-mono">
                    {currentScene === 0 ? "job-application-tracker" :
                        currentScene === 1 ? "data-analytics-dashboard" :
                            "interview-success-pipeline"}
                </div>
            </div>

            <div className="p-6 h-[400px]">
                <AnimatePresence mode="wait">
                    {/* Scene 1: Filtering & Sorting Tables */}
                    {currentScene === 0 && (
                        <motion.div
                            key="table-scene"
                            className="h-full flex flex-col space-y-4"
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={sceneVariants}
                        >
                            <motion.div
                                className="flex justify-between items-center"
                                variants={itemVariants}
                            >
                                <div className="text-lg font-semibold text-white">Application Tracker</div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex bg-slate-800 rounded-md p-1.5">
                                        <Search className="h-4 w-4 text-indigo-400" />
                                    </div>
                                    <div className="flex bg-slate-800 rounded-md p-1.5">
                                        <Filter className="h-4 w-4 text-indigo-400" />
                                    </div>
                                    <div className="flex bg-slate-800 rounded-md p-1.5">
                                        <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="bg-slate-800/50 rounded-lg p-3 border border-slate-700"
                                variants={itemVariants}
                            >
                                <div className="grid grid-cols-5 gap-2 text-xs font-medium text-slate-400 border-b border-slate-700 pb-2">
                                    <div>Company</div>
                                    <div>Position</div>
                                    <div>Date Applied</div>
                                    <div>Status</div>
                                    <div>Actions</div>
                                </div>

                                {[
                                    { company: "TechCorp", position: "Frontend Developer", date: "Mar 10", status: "Interview", statusColor: "text-green-400" },
                                    { company: "DataSys", position: "Full Stack Engineer", date: "Mar 08", status: "Applied", statusColor: "text-blue-400" },
                                    { company: "CodeWave", position: "React Developer", date: "Mar 05", status: "Assessment", statusColor: "text-yellow-400" },
                                    { company: "DevHQ", position: "UI Engineer", date: "Mar 01", status: "Rejected", statusColor: "text-red-400" },
                                    { company: "SoftSolve", position: "JavaScript Developer", date: "Feb 25", status: "Interview", statusColor: "text-green-400" }
                                ].map((job, index) => (
                                    <motion.div
                                        key={index}
                                        className="grid grid-cols-5 gap-2 text-sm text-white py-3 border-b border-slate-700/50"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            transition: { delay: 0.2 + (index * 0.1) }
                                        }}
                                    >
                                        <div className="font-medium">{job.company}</div>
                                        <div>{job.position}</div>
                                        <div className="text-slate-400">{job.date}</div>
                                        <div className={job.statusColor}>{job.status}</div>
                                        <div>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                className="bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-md text-xs"
                                            >
                                                Details
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                            <motion.div
                                className="flex justify-between text-sm mt-auto"
                                variants={itemVariants}
                            >
                                <div className="text-slate-400">
                                    <span className="text-white font-medium">20</span> applications this month
                                </div>
                                <div className="text-indigo-400">
                                    <span className="text-white font-medium">5</span> interviews scheduled
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Scene 2: Analytics & Visualizations */}
                    {currentScene === 1 && (
                        <motion.div
                            key="analytics-scene"
                            className="h-full flex flex-col space-y-4"
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={sceneVariants}
                        >
                            <motion.div
                                className="flex justify-between items-center"
                                variants={itemVariants}
                            >
                                <div className="text-lg font-semibold text-white">Application Analytics</div>
                                <div className="flex items-center space-x-2">
                                    <motion.div
                                        className="flex bg-blue-800/30 text-blue-400 rounded-md px-2 py-1 text-xs items-center"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <LineChart className="h-3 w-3 mr-1" />
                                        Monthly
                                    </motion.div>
                                    <motion.div
                                        className="flex bg-purple-800/30 text-purple-400 rounded-md px-2 py-1 text-xs items-center"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <PieChart className="h-3 w-3 mr-1" />
                                        Categories
                                    </motion.div>
                                </div>
                            </motion.div>

                            <div className="grid grid-cols-2 gap-3">
                                <motion.div
                                    className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
                                    variants={itemVariants}
                                >
                                    <div className="text-xs font-medium text-slate-400 mb-2">Applications by Status</div>
                                    <div className="mt-2 h-32 flex items-end justify-around">
                                        {[65, 38, 25, 12, 5].map((value, index) => (
                                            <motion.div
                                                key={index}
                                                className="relative"
                                                initial={{ height: 0 }}
                                                animate={{
                                                    height: `${value}%`,
                                                    transition: { duration: 1, delay: 0.2 + (index * 0.1) }
                                                }}
                                            >
                                                <div
                                                    className={`w-6 ${index === 0 ? "bg-indigo-500" :
                                                        index === 1 ? "bg-blue-500" :
                                                            index === 2 ? "bg-purple-500" :
                                                                index === 3 ? "bg-pink-500" :
                                                                    "bg-green-500"
                                                        } rounded-t-sm`}
                                                    style={{ height: `${value}%` }}
                                                />
                                                <div className="text-xs text-slate-400 mt-2 text-center">
                                                    {index === 0 ? "Applied" :
                                                        index === 1 ? "Screen" :
                                                            index === 2 ? "Interview" :
                                                                index === 3 ? "Final" :
                                                                    "Offer"}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
                                    variants={itemVariants}
                                >
                                    <div className="text-xs font-medium text-slate-400 mb-2">Response Rate by Source</div>
                                    <div className="relative h-32 mt-2">
                                        <div className="absolute inset-0 flex flex-col justify-center items-center">
                                            <svg width="120" height="120" viewBox="0 0 120 120">
                                                <motion.circle
                                                    cx="60"
                                                    cy="60"
                                                    r="54"
                                                    fill="none"
                                                    stroke="#6366F1"
                                                    strokeWidth="12"
                                                    strokeDasharray="339.292"
                                                    strokeDashoffset="339.292"
                                                    initial={{ strokeDashoffset: 339.292 }}
                                                    animate={{
                                                        strokeDashoffset: 339.292 * 0.32,
                                                        transition: { duration: 1.5, ease: "easeInOut" }
                                                    }}
                                                    strokeLinecap="round"
                                                />
                                                <motion.circle
                                                    cx="60"
                                                    cy="60"
                                                    r="38"
                                                    fill="none"
                                                    stroke="#8B5CF6"
                                                    strokeWidth="12"
                                                    strokeDasharray="238.76"
                                                    strokeDashoffset="238.76"
                                                    initial={{ strokeDashoffset: 238.76 }}
                                                    animate={{
                                                        strokeDashoffset: 238.76 * 0.55,
                                                        transition: { duration: 1.5, ease: "easeInOut", delay: 0.2 }
                                                    }}
                                                    strokeLinecap="round"
                                                />
                                                <motion.circle
                                                    cx="60"
                                                    cy="60"
                                                    r="22"
                                                    fill="none"
                                                    stroke="#EC4899"
                                                    strokeWidth="12"
                                                    strokeDasharray="138.23"
                                                    strokeDashoffset="138.23"
                                                    initial={{ strokeDashoffset: 138.23 }}
                                                    animate={{
                                                        strokeDashoffset: 138.23 * 0.25,
                                                        transition: { duration: 1.5, ease: "easeInOut", delay: 0.4 }
                                                    }}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="text-xl font-bold text-white">68%</div>
                                            <div className="text-xs text-slate-400">Referrals</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <motion.div
                                className="grid grid-cols-4 gap-3"
                                variants={itemVariants}
                            >
                                {[
                                    { label: "Total Applied", value: "132", icon: <FileCheck className="h-4 w-4 text-indigo-400" />, change: "+12%" },
                                    { label: "Response Rate", value: "42%", icon: <Mail className="h-4 w-4 text-blue-400" />, change: "+3%" },
                                    { label: "Interviews", value: "28", icon: <Calendar className="h-4 w-4 text-purple-400" />, change: "+5%" },
                                    { label: "Offers", value: "5", icon: <Award className="h-4 w-4 text-pink-400" />, change: "+2" }
                                ].map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        className="bg-slate-800/30 border border-slate-700 rounded-lg p-3"
                                        whileHover={{ scale: 1.03 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="text-xs text-slate-400">{stat.label}</div>
                                            {stat.icon}
                                        </div>
                                        <div className="text-lg font-bold text-white mt-2">{stat.value}</div>
                                        <div className="text-xs text-green-400 mt-1">{stat.change}</div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Scene 3: Landing a Job */}
                    {currentScene === 2 && (
                        <motion.div
                            key="success-scene"
                            className="h-full flex flex-col"
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={sceneVariants}
                        >
                            <motion.div
                                className="bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-indigo-500/30 h-full flex flex-col items-center justify-center text-center"
                                variants={itemVariants}
                            >
                                <motion.div
                                    className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 flex items-center justify-center mb-6"
                                    initial={{ scale: 0 }}
                                    animate={{
                                        scale: 1,
                                        transition: { delay: 0.2, type: "spring", stiffness: 200 }
                                    }}
                                >
                                    <CheckCircle className="h-12 w-12 text-white" />
                                </motion.div>

                                <motion.div
                                    className="text-2xl font-bold text-white mb-2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: 0.4 }
                                    }}
                                >
                                    Congratulations!
                                </motion.div>

                                <motion.div
                                    className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 mb-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: 0.5 }
                                    }}
                                >
                                    You've Landed the Job!
                                </motion.div>

                                <motion.div
                                    className="text-slate-400 mb-8 max-w-md"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: 0.6 }
                                    }}
                                >
                                    Your offer from <span className="text-white font-medium">TechCorp</span> for the position of <span className="text-white font-medium">Senior Frontend Developer</span> has been accepted.
                                </motion.div>

                                <motion.div
                                    className="grid grid-cols-3 gap-4 w-full max-w-md"
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: 1,
                                        transition: { delay: 0.7 }
                                    }}
                                >
                                    {[
                                        { icon: <Briefcase className="h-5 w-5" />, label: "Start Date", value: "April 15" },
                                        { icon: <Star className="h-5 w-5" />, label: "Salary", value: "$125K" },
                                        { icon: <ArrowUpRight className="h-5 w-5" />, label: "Increase", value: "+22%" }
                                    ].map((detail, index) => (
                                        <motion.div
                                            key={index}
                                            className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 flex flex-col items-center"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{
                                                scale: 1,
                                                opacity: 1,
                                                transition: { delay: 0.8 + (index * 0.1) }
                                            }}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center mb-2 text-indigo-400">
                                                {detail.icon}
                                            </div>
                                            <div className="text-xs text-slate-400">{detail.label}</div>
                                            <div className="text-sm font-medium text-white">{detail.value}</div>
                                        </motion.div>
                                    ))}
                                </motion.div>

                                <motion.div
                                    className="mt-8"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: 1.2 }
                                    }}
                                >
                                    <motion.button
                                        className="bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-medium"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        View Onboarding Details
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Scene indicator dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {[0, 1, 2].map((index) => (
                    <motion.button
                        key={index}
                        className={`w-2 h-2 rounded-full ${currentScene === index ? 'bg-indigo-500' : 'bg-slate-600'}`}
                        onClick={() => setCurrentScene(index)}
                        whileHover={{ scale: 1.2 }}
                        animate={{ scale: currentScene === index ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: 0.5, repeat: currentScene === index ? Infinity : 0, repeatType: "reverse" }}
                    />
                ))}
            </div>

            {/* Data flow animation */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={`particle-${i}`}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                            background: `${i % 3 === 0 ? '#6366F1' : i % 3 === 1 ? '#8B5CF6' : '#EC4899'}`
                        }}
                        initial={{
                            x: Math.random() * 100,
                            y: 0,
                            opacity: 0,
                            scale: 0
                        }}
                        animate={{
                            x: [
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100
                            ],
                            y: [0, 100, 400],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0]
                        }}
                        transition={{
                            duration: 4 + Math.random() * 3,
                            repeat: Infinity,
                            delay: i * 0.8
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
