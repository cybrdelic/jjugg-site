import React from 'react'
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
import { Badge } from './badge'

export function FeatureCard({ 
  icon, 
  title, 
  description, 
  badge, 
  badgeVariant = "secondary", 
  footer,
  theme = "dark",
  className,
  index = 0
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileHover={{ 
        y: -5,
        transition: { 
          duration: 0.2, 
          ease: "easeOut" 
        }
      }}
      className={cn(
        "h-full group",
        className
      )}
    >
      <Card className={cn(
        "h-full overflow-hidden border bg-white/5 backdrop-blur-sm transition-all duration-300 group-hover:shadow-md dark:bg-slate-900/20",
        "hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10",
        theme === "dark" ? "border-slate-800" : "border-slate-200",
        className
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        <CardHeader>
          {badge && (
            <div className="mb-2">
              <Badge variant={badgeVariant} className="text-xs font-normal">
                {badge}
              </Badge>
            </div>
          )}
          
          <div className="flex items-start gap-4">
            {icon && (
              <motion.div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
                  theme === "dark" ? "bg-slate-800" : "bg-slate-100"
                )}
                whileHover={{
                  rotate: [0, -10, 10, 0],
                  transition: {
                    duration: 0.5,
                    ease: "easeInOut"
                  }
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }
                  }}
                >
                  {icon}
                </motion.div>
              </motion.div>
            )}
            
            <div>
              <CardTitle className={theme === "dark" ? "text-white" : "text-slate-900"}>
                {title}
              </CardTitle>
              <CardDescription 
                className={cn(
                  "line-clamp-3 mt-2",
                  theme === "dark" ? "text-slate-400" : "text-slate-500"
                )}
              >
                {description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        {footer && (
          <CardFooter className="pt-3 border-t border-slate-200 dark:border-slate-800">
            {footer}
          </CardFooter>
        )}
        
        {/* Top highlight effect on hover */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </Card>
    </motion.div>
  )
}