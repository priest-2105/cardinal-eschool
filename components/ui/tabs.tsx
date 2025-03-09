"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<
  | {
      selectedTab: string
      setSelectedTab: (id: string) => void
    }
  | undefined
>(undefined)

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string
  children: React.ReactNode
}

export function Tabs({ defaultValue, children, className, ...props }: TabsProps) {
  const [selectedTab, setSelectedTab] = React.useState(defaultValue)

  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab }}>
      <div className={cn("space-y-4", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function TabsList({ children, className, ...props }: TabsListProps) {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  children: React.ReactNode
}

export function TabsTrigger({ value, children, className, ...props }: TabsTriggerProps) {
  const context = React.useContext(TabsContext)

  if (!context) {
    throw new Error("TabsTrigger must be used within a Tabs component")
  }

  const { selectedTab, setSelectedTab } = context

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selectedTab === value}
      data-state={selectedTab === value ? "active" : "inactive"}
      onClick={() => setSelectedTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        selectedTab === value
          ? "bg-background text-foreground shadow-sm"
          : "hover:bg-background/50 hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  children: React.ReactNode
}

export function TabsContent({ value, children, className, ...props }: TabsContentProps) {
  const context = React.useContext(TabsContext)

  if (!context) {
    throw new Error("TabsContent must be used within a Tabs component")
  }

  const { selectedTab } = context

  if (selectedTab !== value) {
    return null
  }

  return (
    <div
      role="tabpanel"
      data-state={selectedTab === value ? "active" : "inactive"}
      className={cn("mt-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

