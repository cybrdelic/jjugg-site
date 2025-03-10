import React from 'react'
import { cn } from "@/lib/utils"
import { motion } from 'framer-motion'

export function CodeBlock({ 
  children, 
  language = "bash", 
  showLineNumbers = false,
  className,
  animated = false,
  delay = 0,
  ...props 
}) {
  const content = typeof children === 'string' ? children : ''
  const lines = content.trim().split('\n')

  const MotionWrapper = animated ? motion.div : 'div'
  const animationProps = animated ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: delay }
  } : {}

  return (
    <MotionWrapper
      className={cn(
        "relative rounded-lg overflow-hidden",
        language === "bash" ? "bg-slate-950 text-slate-50 dark:bg-slate-900" : "",
        language === "javascript" ? "bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100" : "",
        language === "typescript" ? "bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100" : "",
        language === "rust" ? "bg-orange-50 text-orange-900 dark:bg-orange-950 dark:text-orange-100" : "",
        className
      )}
      {...animationProps}
      {...props}
    >
      {/* Header with language badge */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-opacity-10 border-slate-700 dark:border-slate-600">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-xs opacity-70 font-mono">
            {language}
          </div>
        </div>
      </div>

      {/* Code content */}
      <div className="p-4 font-mono text-sm overflow-x-auto">
        <pre className="language-{language}">
          {lines.map((line, i) => (
            <div key={i} className="table-row">
              {showLineNumbers && (
                <span className="table-cell pr-4 text-slate-500 text-right select-none">{i + 1}</span>
              )}
              <span className="table-cell">
                {line.startsWith('# ') || line.startsWith('// ') ? (
                  <span className="text-slate-500 dark:text-slate-400">{line}</span>
                ) : language === "bash" ? (
                  formatBashLine(line)
                ) : (
                  line
                )}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </MotionWrapper>
  )
}

// Helper to format bash commands with syntax highlighting
function formatBashLine(line) {
  if (line.startsWith('$ ')) {
    return (
      <>
        <span className="text-purple-400">$</span>
        <span>{line.substring(1)}</span>
      </>
    )
  }
  
  if (line.includes('success')) {
    return <span className="text-green-400">{line}</span>
  }
  
  if (line.includes('error')) {
    return <span className="text-red-400">{line}</span>
  }
  
  if (line.includes('warning')) {
    return <span className="text-yellow-400">{line}</span>
  }
  
  if (line.includes('info')) {
    return <span className="text-blue-400">{line}</span>
  }
  
  return line
}