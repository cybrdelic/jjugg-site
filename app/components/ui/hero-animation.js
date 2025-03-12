"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
    BarChart3,
    PieChart,
    LineChart,
    CheckCircle,
    Briefcase,
    Star,
    ArrowUpRight,
    Code,
    CheckCheck,
    Trophy,
    DollarSign,
    Search
} from 'lucide-react';

// Global Animation Variants
const sceneVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        filter: "blur(8px)",
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
};

const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } }
};

// Enhanced Background Component
function AnimatedBackground({ isDark }) {
    return (
        <div className={`absolute inset-0 overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
            {/* Dual Gradient Layers */}
            <div className="absolute inset-0 opacity-70">
                <div className={`absolute inset-0 bg-gradient-to-br ${isDark
                    ? 'from-indigo-900/30 via-slate-900 to-purple-900/30'
                    : 'from-indigo-100/80 via-slate-50 to-purple-100/80'
                    }`}></div>
                <div className="absolute inset-0 bg-radial from-transparent via-white/10 to-transparent"></div>
            </div>

            {/* SVG Grid Pattern */}
            <svg
                className={`absolute inset-0 w-full h-full ${isDark ? 'text-slate-800' : 'text-slate-200'}`}
                xmlns="http://www.w3.org/2000/svg"
            >
                <motion.pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5 }}
                >
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </motion.pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Refined Animated Dots */}
            <div className="absolute inset-0">
                {Array.from({ length: 80 }).map((_, i) => (
                    <motion.div
                        key={`dot-${i}`}
                        className={`absolute rounded-full ${isDark ? 'bg-indigo-500' : 'bg-indigo-300'}`}
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: Math.random() < 0.3 ? '2px' : '1px',
                            height: Math.random() < 0.3 ? '2px' : '1px',
                            opacity: Math.random() * 0.3
                        }}
                        animate={{ opacity: [Math.random() * 0.1, Math.random() * 0.3, Math.random() * 0.1] }}
                        transition={{
                            duration: 3 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 4
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

// Scene 1: Application Tracker with Enhanced Card Design
function SceneApplication({ isDark }) {
    const jobData = [
        { company: "TechCorp", role: "Frontend Developer", status: "Interview", color: "emerald" },
        { company: "DataSys", role: "Full Stack Engineer", status: "Applied", color: "blue" },
        { company: "CodeWave", role: "React Developer", status: "Assessment", color: "amber" }
    ];

    const colorMap = {
        emerald: {
            bg: isDark ? 'bg-emerald-500/20' : 'bg-emerald-100',
            text: isDark ? 'text-emerald-400' : 'text-emerald-600',
            side: 'bg-emerald-500'
        },
        blue: {
            bg: isDark ? 'bg-blue-500/20' : 'bg-blue-100',
            text: isDark ? 'text-blue-400' : 'text-blue-600',
            side: 'bg-blue-500'
        },
        amber: {
            bg: isDark ? 'bg-amber-500/20' : 'bg-amber-100',
            text: isDark ? 'text-amber-400' : 'text-amber-600',
            side: 'bg-amber-500'
        }
    };

    return (
        <motion.div
            key="application-scene"
            className="w-full h-full flex items-center justify-center px-4"
            variants={sceneVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <div className="w-full max-w-3xl">
                <motion.div
                    className={`w-full rounded-2xl overflow-hidden shadow-xl ${isDark ? 'bg-slate-800/70 border border-slate-700' : 'bg-white/95 border border-slate-200'
                        } backdrop-blur-lg`}
                    variants={itemVariants}
                >
                    {/* App Header */}
                    <motion.div
                        className={`px-6 py-4 flex items-center justify-between border-b ${isDark ? 'border-slate-700' : 'border-slate-200'
                            }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center">
                            <motion.div
                                className={`flex items-center justify-center w-10 h-10 rounded-lg mr-4 ${isDark ? 'bg-indigo-500/25' : 'bg-indigo-100'
                                    }`}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                                <Code className="w-5 h-5 text-indigo-500" />
                            </motion.div>
                            <div>
                                <div className={`font-bold text-xl ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    Application Tracker
                                </div>
                                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    20 applications this month
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <motion.div
                                className={`w-9 h-9 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'
                                    }`}
                                whileHover={{
                                    scale: 1.1,
                                    backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)'
                                }}
                            >
                                <Search className="w-4 h-4 text-indigo-500" />
                            </motion.div>
                            <motion.div
                                className={`w-9 h-9 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'
                                    }`}
                                whileHover={{
                                    scale: 1.1,
                                    backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'
                                }}
                            >
                                <BarChart3 className="w-4 h-4 text-purple-500" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Application Cards */}
                    <motion.div className="p-6 space-y-4">
                        {jobData.map((job, index) => (
                            <motion.div
                                key={index}
                                className={`p-5 rounded-2xl ${isDark ? 'bg-slate-700/60' : 'bg-slate-50'} backdrop-blur-md relative overflow-hidden group`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0, transition: { delay: 0.3 + index * 0.1 } }}
                                whileHover={{
                                    y: -2,
                                    boxShadow: isDark
                                        ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                                        : '0 10px 15px -3px rgba(0, 0, 0, 0.15)'
                                }}
                            >
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${colorMap[job.color].side}`} />
                                <div className="flex justify-between">
                                    <div>
                                        <div className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {job.company}
                                        </div>
                                        <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                            {job.role}
                                        </div>
                                    </div>
                                    <div
                                        className={`px-3 py-1 text-xs font-medium rounded-full flex items-center ${colorMap[job.color].bg} ${colorMap[job.color].text}`}
                                    >
                                        {job.status === "Interview" && (
                                            <motion.span
                                                className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        )}
                                        {job.status}
                                    </div>
                                </div>
                                {/* Animated Job Journey */}
                                <div className="mt-4 h-6">
                                    <svg width="100%" height="24" viewBox="0 0 300 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                                        <motion.line
                                            x1="10"
                                            y1="12"
                                            x2="290"
                                            y2="12"
                                            stroke={isDark ? "rgba(100, 116, 139, 0.3)" : "rgba(148, 163, 184, 0.5)"}
                                            strokeWidth="2"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ delay: 0.5 + index * 0.1, duration: 1.5 }}
                                        />
                                        <motion.line
                                            x1="10"
                                            y1="12"
                                            x2="290"
                                            y2="12"
                                            stroke={
                                                job.color === "emerald" ? "#10B981" :
                                                    job.color === "blue" ? "#3B82F6" : "#F59E0B"
                                            }
                                            strokeWidth="2"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: job.status === "Interview" ? 0.75 : job.status === "Applied" ? 0.25 : 0.5 }}
                                            transition={{ delay: 0.8 + index * 0.1, duration: 1.5 }}
                                        />
                                        {[0, 0.25, 0.5, 0.75, 1].map((milestone, i) => (
                                            <motion.circle
                                                key={i}
                                                cx={10 + milestone * 280}
                                                cy="12"
                                                r="5"
                                                fill={
                                                    ((job.status === "Interview" && milestone <= 0.75) ||
                                                        (job.status === "Applied" && milestone <= 0.25) ||
                                                        (job.status === "Assessment" && milestone <= 0.5))
                                                        ? job.color === "emerald" ? "#10B981" : job.color === "blue" ? "#3B82F6" : "#F59E0B"
                                                        : isDark ? "#1E293B" : "#E2E8F0"
                                                }
                                                stroke={
                                                    ((job.status === "Interview" && milestone <= 0.75) ||
                                                        (job.status === "Applied" && milestone <= 0.25) ||
                                                        (job.status === "Assessment" && milestone <= 0.5))
                                                        ? job.color === "emerald" ? "#10B981" : job.color === "blue" ? "#3B82F6" : "#F59E0B"
                                                        : isDark ? "rgba(100, 116, 139, 0.5)" : "rgba(148, 163, 184, 0.5)"
                                                }
                                                strokeWidth="2"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 1 + index * 0.1 + i * 0.1, duration: 0.4 }}
                                            />
                                        ))}
                                        {["Applied", "Screening", "Assessment", "Interview", "Offer"].map((label, i) => (
                                            <motion.text
                                                key={`label-${i}`}
                                                x={i === 0 ? 10 : i === 4 ? 290 : 80 + (i - 1) * 70}
                                                y="24"
                                                fontSize="9"
                                                textAnchor="middle"
                                                fill={isDark ? "rgba(148, 163, 184, 0.7)" : "rgba(100, 116, 139, 0.7)"}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 1.5 + index * 0.1 }}
                                            >
                                                {label}
                                            </motion.text>
                                        ))}
                                    </svg>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}

// Scene 2: Enhanced Analytics Visualization
function SceneAnalytics({ isDark }) {
    return (
        <motion.div
            key="analytics-scene"
            className="w-full h-full flex items-center justify-center px-4"
            variants={sceneVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <div className="w-full max-w-3xl">
                <motion.div
                    className={`w-full rounded-2xl overflow-hidden shadow-xl ${isDark ? 'bg-slate-800/70 border border-slate-700' : 'bg-white/95 border border-slate-200'
                        } backdrop-blur-lg p-6`}
                    variants={itemVariants}
                >
                    <motion.div className="mb-6 flex justify-between items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                        <div>
                            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Application Analytics</h3>
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Visualize your performance with clarity</p>
                        </div>
                        <div className="flex space-x-3">
                            <motion.div
                                className={`px-3 py-1 text-xs font-medium rounded-full ${isDark ? 'bg-blue-500/25 text-blue-400' : 'bg-blue-100 text-blue-600'
                                    }`}
                                whileHover={{ scale: 1.05, y: -1 }}
                            >
                                <LineChart className="h-3 w-3 inline-block mr-1" />Monthly
                            </motion.div>
                            <motion.div
                                className={`px-3 py-1 text-xs font-medium rounded-full ${isDark ? 'bg-purple-500/25 text-purple-400' : 'bg-purple-100 text-purple-600'
                                    }`}
                                whileHover={{ scale: 1.05, y: -1 }}
                            >
                                <PieChart className="h-3 w-3 inline-block mr-1" />Breakdown
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Refined SVG Analytics Chart */}
                    <div className="mx-auto">
                        <svg width="100%" height="220" viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {[0, 1, 2, 3, 4].map((line) => (
                                <motion.line
                                    key={`grid-${line}`}
                                    x1="40"
                                    y1={40 + line * 40}
                                    x2="480"
                                    y2={40 + line * 40}
                                    stroke={isDark ? "rgba(100, 116, 139, 0.2)" : "rgba(226, 232, 240, 0.8)"}
                                    strokeWidth="1"
                                    strokeDasharray="5,5"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 + line * 0.1 }}
                                />
                            ))}
                            <motion.line
                                x1="40"
                                y1="40"
                                x2="40"
                                y2="200"
                                stroke={isDark ? "rgba(148, 163, 184, 0.5)" : "rgba(100, 116, 139, 0.5)"}
                                strokeWidth="2"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1 }}
                            />
                            <motion.line
                                x1="40"
                                y1="200"
                                x2="480"
                                y2="200"
                                stroke={isDark ? "rgba(148, 163, 184, 0.5)" : "rgba(100, 116, 139, 0.5)"}
                                strokeWidth="2"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1 }}
                            />
                            {[0, 25, 50, 75, 100].reverse().map((value, i) => (
                                <motion.text
                                    key={`y-label-${i}`}
                                    x="30"
                                    y={45 + i * 40}
                                    fontSize="12"
                                    textAnchor="end"
                                    fill={isDark ? "rgba(148, 163, 184, 0.7)" : "rgba(100, 116, 139, 0.7)"}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 + i * 0.1 }}
                                >
                                    {value}%
                                </motion.text>
                            ))}
                            {['Applied', 'Screened', 'Interviewed', 'Final Round', 'Offer'].map((label, i) => (
                                <motion.text
                                    key={`x-label-${i}`}
                                    x={80 + i * 100}
                                    y="220"
                                    fontSize="12"
                                    textAnchor="middle"
                                    fill={isDark ? "rgba(148, 163, 184, 0.7)" : "rgba(100, 116, 139, 0.7)"}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.3 + i * 0.1 }}
                                >
                                    {label}
                                </motion.text>
                            ))}
                            {/* Data Bars */}
                            <motion.rect
                                x="60"
                                y="40"
                                width="40"
                                height="160"
                                rx="3"
                                fill="rgba(99, 102, 241, 0.7)"
                                initial={{ height: 0, y: 220 }}
                                animate={{ height: 160, y: 40 }}
                                transition={{ delay: 1.5, duration: 1, ease: "easeOut" }}
                            />
                            <motion.rect
                                x="160"
                                y="80"
                                width="40"
                                height="120"
                                rx="3"
                                fill="rgba(99, 102, 241, 0.7)"
                                initial={{ height: 0, y: 220 }}
                                animate={{ height: 120, y: 80 }}
                                transition={{ delay: 1.6, duration: 1, ease: "easeOut" }}
                            />
                            <motion.rect
                                x="260"
                                y="120"
                                width="40"
                                height="80"
                                rx="3"
                                fill="rgba(99, 102, 241, 0.7)"
                                initial={{ height: 0, y: 220 }}
                                animate={{ height: 80, y: 120 }}
                                transition={{ delay: 1.7, duration: 1, ease: "easeOut" }}
                            />
                            <motion.rect
                                x="360"
                                y="160"
                                width="40"
                                height="40"
                                rx="3"
                                fill="rgba(99, 102, 241, 0.7)"
                                initial={{ height: 0, y: 220 }}
                                animate={{ height: 40, y: 160 }}
                                transition={{ delay: 1.8, duration: 1, ease: "easeOut" }}
                            />
                            <motion.rect
                                x="460"
                                y="180"
                                width="40"
                                height="20"
                                rx="3"
                                fill="rgba(99, 102, 241, 0.7)"
                                initial={{ height: 0, y: 220 }}
                                animate={{ height: 20, y: 180 }}
                                transition={{ delay: 1.9, duration: 1, ease: "easeOut" }}
                            />
                        </svg>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

// Scene 3: Success Celebration with a Polished Look
function SceneSuccess({ isDark }) {
    return (
        <motion.div
            key="success-scene"
            className="w-full h-full flex items-center justify-center px-4"
            variants={sceneVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <div className="w-full max-w-lg text-center relative">
                <motion.div className="mb-6" variants={itemVariants}>
                    <motion.div
                        className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 shadow-2xl"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: [0, 5, 0, -5, 0] }}
                        transition={{ scale: { type: "spring", stiffness: 200 }, rotate: { duration: 1, delay: 0.5 } }}
                    >
                        <CheckCheck className="w-12 h-12 text-white" />
                    </motion.div>
                </motion.div>
                <motion.div className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    Congratulations!
                </motion.div>
                <motion.div
                    className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    You Landed The Job!
                </motion.div>
                <motion.div className={`text-lg mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                    Your offer from <span className="font-bold">TechCorp</span> is official.
                </motion.div>
                <motion.div className="grid grid-cols-3 gap-4 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                    {[
                        { icon: <Briefcase />, label: "Start Date", value: "April 15" },
                        { icon: <DollarSign />, label: "Salary", value: "$125,000" },
                        { icon: <ArrowUpRight />, label: "Increase", value: "+22%" }
                    ].map((detail, index) => (
                        <motion.div
                            key={index}
                            className={`p-5 rounded-2xl ${isDark ? 'bg-slate-800/70' : 'bg-white/90'} backdrop-blur-md border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 + index * 0.2 }}
                            whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)" }}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${index === 0 ? 'bg-indigo-500/25 text-indigo-500' : index === 1 ? 'bg-blue-500/25 text-blue-500' : 'bg-emerald-500/25 text-emerald-500'
                                }`}>
                                {detail.icon}
                            </div>
                            <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-1`}>{detail.label}</div>
                            <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{detail.value}</div>
                        </motion.div>
                    ))}
                </motion.div>
                <motion.button
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white font-medium shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 15px 25px -5px rgba(99, 102, 241, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                >
                    View Onboarding Details
                </motion.button>

                {/* Subtle Confetti Animation */}
                <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <motion.div
                            key={`confetti-${i}`}
                            className={`absolute w-2 h-2 ${i % 2 === 0 ? 'rounded-full' : 'rounded-sm'}`}
                            style={{
                                backgroundColor:
                                    i % 5 === 0 ? '#6366F1' : i % 5 === 1 ? '#8B5CF6' : i % 5 === 2 ? '#EC4899' : i % 5 === 3 ? '#3B82F6' : '#10B981',
                                left: `${Math.random() * 100}%`,
                                top: '-5%'
                            }}
                            animate={{ y: [0, 400], x: [0, (Math.random() - 0.5) * 150], rotate: [0, Math.random() * 360], opacity: [1, 0] }}
                            transition={{
                                duration: 2.5 + Math.random() * 2,
                                ease: "easeOut",
                                delay: Math.random() * 1,
                                repeat: Infinity,
                                repeatDelay: Math.random() * 5
                            }}
                        />
                    ))}
                </div>

                {/* Trophy & Star Animations */}
                <motion.div
                    className="absolute top-8 right-8 text-yellow-500 opacity-70"
                    animate={{ opacity: [0.5, 0.8, 0.5], rotate: [0, 10, 0], scale: [0.9, 1, 0.9] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Trophy size={40} />
                </motion.div>
                <motion.div
                    className="absolute bottom-8 left-8 text-indigo-500 opacity-70"
                    animate={{ opacity: [0.5, 0.8, 0.5], rotate: [0, -10, 0], scale: [0.9, 1, 0.9] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                    <Star size={40} />
                </motion.div>
            </div>
        </motion.div>
    );
}

// Main HeroAnimation Component
export function HeroAnimation() {
    const { theme } = useTheme();
    const [currentScene, setCurrentScene] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => setCurrentScene((prev) => (prev + 1) % 3), 6000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;
    const isDark = theme === 'dark';

    return (
        <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl">
            <AnimatedBackground isDark={isDark} />
            <div className="h-[320px] md:h-[440px] p-4 relative z-10">
                <AnimatePresence mode="wait">
                    {currentScene === 0 && <SceneApplication isDark={isDark} />}
                    {currentScene === 1 && <SceneAnalytics isDark={isDark} />}
                    {currentScene === 2 && <SceneSuccess isDark={isDark} />}
                </AnimatePresence>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                {[0, 1, 2].map((index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentScene(index)}
                        className="focus:outline-none"
                        aria-label={`View scene ${index + 1}`}
                    >
                        <motion.div
                            className={`w-3 h-3 rounded-full ${currentScene === index ? 'bg-indigo-500' : isDark ? 'bg-slate-600' : 'bg-slate-300'
                                }`}
                            whileHover={{ scale: 1.2 }}
                            animate={
                                currentScene === index
                                    ? { scale: [1, 1.2, 1], boxShadow: ['0 0 0 0 rgba(99,102,241,0)', '0 0 0 4px rgba(99,102,241,0.3)', '0 0 0 0 rgba(99,102,241,0)'] }
                                    : {}
                            }
                            transition={{ duration: 2, repeat: currentScene === index ? Infinity : 0 }}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
