import React from 'react'
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"
import { 
  BrowserIcon, 
  CircleIcon, 
  Code, 
  Database, 
  File, 
  Folder, 
  FolderInput, 
  Mail, 
  MessageSquare, 
  MonitorSmartphone,
  Package,
  Server,
  Sparkles, 
  UserCircle2
} from 'lucide-react'

const WorkflowStep = ({ 
  icon: Icon, 
  title, 
  description, 
  color = "indigo", 
  colorDark,
  index,
  isLast,
  theme = "dark"
}) => {
  const colorClasses = {
    indigo: theme === "dark" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30" : "bg-indigo-50 text-indigo-600 border-indigo-200",
    blue: theme === "dark" ? "bg-blue-500/10 text-blue-400 border-blue-500/30" : "bg-blue-50 text-blue-600 border-blue-200", 
    purple: theme === "dark" ? "bg-purple-500/10 text-purple-400 border-purple-500/30" : "bg-purple-50 text-purple-600 border-purple-200",
    green: theme === "dark" ? "bg-green-500/10 text-green-400 border-green-500/30" : "bg-green-50 text-green-600 border-green-200",
    amber: theme === "dark" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : "bg-amber-50 text-amber-600 border-amber-200",
  }
  
  const actualColor = colorDark && theme === "dark" ? colorDark : color
  
  return (
    <motion.div 
      className="flex relative z-10"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="flex flex-col items-center mr-4">
        <motion.div 
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full border-2",
            colorClasses[actualColor]
          )}
          initial={{ scale: 0.8 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", duration: 0.5, delay: index * 0.1 + 0.2 }}
          whileHover={{ scale: 1.1 }}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
        
        {!isLast && (
          <motion.div 
            className={cn(
              "w-px h-full my-2",
              theme === "dark" ? "bg-slate-800" : "bg-slate-200"
            )}
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
          />
        )}
      </div>
      
      <div className="pt-1 pb-8">
        <h3 className={cn(
          "text-lg font-semibold mb-1",
          colorClasses[actualColor]
        )}>
          {title}
        </h3>
        <p className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
          {description}
        </p>
      </div>
    </motion.div>
  )
}

export function Workflow({ 
  className,
  theme = "dark"
}) {
  const steps = [
    {
      icon: BrowserIcon,
      title: "1. Browser Extension Captures Data",
      description: "UserScripts automatically detect and extract job application data as you apply on any job site, storing it in localStorage.",
      color: "indigo"
    },
    {
      icon: Database,
      title: "2. Data Synchronization",
      description: "When you run jjugg locally, it pulls all stored application data from your browser into your personal database.",
      color: "blue"
    },
    {
      icon: Mail,
      title: "3. Email Tracking Integration",
      description: "AI-powered parsers scan your emails to detect status changes, interview invitations, and follow-ups.",
      color: "purple"
    },
    {
      icon: Sparkles,
      title: "4. Interview Preparation",
      description: "Based on job descriptions, jjugg uses LLMs to generate custom interview questions and talking points.",
      color: "green"
    },
    {
      icon: Server,
      title: "5. Private & Self-Hosted",
      description: "All your data remains on your machine. No cloud storage or third-party access to your sensitive information.",
      color: "amber",
      isLast: true
    }
  ]
  
  return (
    <div className={cn("relative", className)}>
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className={cn(
            "absolute left-4 top-0 bottom-0 w-px",
            theme === "dark" ? "bg-gradient-to-b from-indigo-500/0 via-indigo-500/10 to-purple-500/0" : "bg-gradient-to-b from-indigo-500/0 via-indigo-500/20 to-purple-500/0"
          )}
        />
      </div>
      
      <div className="relative z-10">
        {steps.map((step, index) => (
          <WorkflowStep
            key={index}
            {...step}
            index={index}
            isLast={index === steps.length - 1}
            theme={theme}
          />
        ))}
      </div>
      
      {/* Data flow animation */}
      <div className="absolute left-4 top-0 bottom-0 transform -translate-x-1/2 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "absolute w-2 h-2 rounded-full",
              i % 2 === 0 ? "bg-indigo-500" : "bg-purple-500"
            )}
            style={{ top: "0%" }}
            animate={{
              top: ["0%", "100%"],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 5,
              ease: "linear",
              repeat: Infinity,
              delay: i * 1.2
            }}
          />
        ))}
      </div>
    </div>
  )
}