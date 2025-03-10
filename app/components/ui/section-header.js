import React from 'react'
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"
import { Badge } from './badge'
import { Separator } from './separator'

export function SectionHeader({
  badge,
  title,
  description,
  align = "center",
  theme = "dark",
  className,
  separator = true,
  gradient = true,
  titleSize = "default",
  children
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "max-w-3xl mx-auto mb-16",
        align === "center" ? "text-center" : "text-left",
        align === "center" ? "items-center" : "items-start",
        className
      )}
    >
      {badge && (
        <div className="inline-block mb-4">
          <Badge 
            variant="secondary" 
            className={cn(
              "px-4 py-1 rounded-full text-sm",
              theme === "dark" 
              ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/15" 
              : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
            )}
          >
            {badge}
          </Badge>
        </div>
      )}
      
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={cn(
          "font-bold mb-4",
          titleSize === "default" ? "text-4xl md:text-5xl" : "",
          titleSize === "large" ? "text-5xl md:text-6xl" : "",
          titleSize === "small" ? "text-3xl md:text-4xl" : "",
          theme === "dark" ? "text-white" : "text-slate-900"
        )}
      >
        {gradient ? (
          <>
            {title.split(' ').map((word, i) => (
              i % 3 === 1 ? (
                <motion.span
                  key={i}
                  className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500"
                  animate={{
                    backgroundPosition: ['0% center', '100% center', '0% center'],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.05
                  }}
                >
                  {word}{' '}
                </motion.span>
              ) : (
                <span key={i}>{word}{' '}</span>
              )
            ))}
          </>
        ) : (
          title
        )}
      </motion.h2>
      
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={cn(
            "text-lg max-w-2xl",
            align === "center" ? "mx-auto" : "",
            theme === "dark" ? "text-slate-400" : "text-slate-600"
          )}
        >
          {description}
        </motion.p>
      )}
      
      {children && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6"
        >
          {children}
        </motion.div>
      )}
      
      {separator && (
        <div className={cn(
          "w-full mt-10",
          align === "center" ? "flex justify-center" : ""
        )}>
          <Separator className={cn(
            "bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent h-px",
            align === "center" ? "w-40" : "max-w-md"
          )} />
        </div>
      )}
    </motion.div>
  )
}