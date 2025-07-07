"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

const SidebarContext = React.createContext<{
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  collapsible: "always" | "responsive" | "none"
}>({
  collapsed: false,
  setCollapsed: () => undefined,
  collapsible: "none",
})

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsible?: "always" | "responsive" | "none"
  defaultCollapsed?: boolean
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, collapsible = "responsive", defaultCollapsed = false, ...props }, ref) => {
    const [collapsed, setCollapsed] = React.useState(defaultCollapsed)

    return (
      <SidebarContext.Provider value={{ collapsed, setCollapsed, collapsible }}>
        <div
          ref={ref}
          data-collapsed={collapsed}
          className={cn(
            "group relative flex h-full flex-col gap-4 border-r bg-background transition-[width] duration-300",
            collapsed ? "w-14" : "w-64",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    )
  },
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex h-14 items-center border-b px-4", className)} {...props}>
        {children}
      </div>
    )
  },
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-1 flex-col gap-2 overflow-hidden", className)} {...props}>
        {children}
      </div>
    )
  },
)
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center border-t p-4", className)} {...props}>
        {children}
      </div>
    )
  },
)
SidebarFooter.displayName = "SidebarFooter"

const SidebarToggle = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const { collapsed, setCollapsed, collapsible } = React.useContext(SidebarContext)

    if (collapsible === "none") {
      return null
    }

    if (collapsible === "responsive") {
      return (
        <button
          ref={ref}
          type="button"
          className={cn(
            "absolute -right-3 top-10 flex h-6 w-6 items-center justify-center rounded-full border bg-background text-muted-foreground sm:hidden",
            className,
          )}
          onClick={() => setCollapsed((prev) => !prev)}
          {...props}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      )
    }

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "absolute -right-3 top-10 flex h-6 w-6 items-center justify-center rounded-full border bg-background text-muted-foreground",
          className,
        )}
        onClick={() => setCollapsed((prev) => !prev)}
        {...props}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    )
  },
)
SidebarToggle.displayName = "SidebarToggle"

const SidebarInset = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex h-full flex-1 flex-col", className)} {...props}>
        {children}
      </div>
    )
  },
)
SidebarInset.displayName = "SidebarInset"

const SidebarRail = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { collapsed, collapsible } = React.useContext(SidebarContext)

    if (collapsible === "none") {
      return null
    }

    if (collapsible === "responsive") {
      return (
        <div
          ref={ref}
          className={cn(
            "absolute inset-y-0 right-0 w-px bg-border opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100",
            className,
          )}
          {...props}
        />
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "absolute inset-y-0 right-0 w-px bg-border opacity-0 transition-opacity group-hover:opacity-100",
          collapsed ? "opacity-0" : "opacity-100",
          className,
        )}
        {...props}
      />
    )
  },
)
SidebarRail.displayName = "SidebarRail"

const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <div className="flex h-full w-full">{children}</div>
}

const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9",
          className,
        )}
        {...props}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Toggle Menu</span>
      </button>
    )
  },
)
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("px-2 py-1", className)} {...props} />
  },
)
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props} />
  },
)
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props} />
  },
)
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("", className)} {...props} />
  },
)
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { collapsed } = React.useContext(SidebarContext)

    return (
      <button
        ref={ref}
        className={cn(
          "group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:bg-accent focus:text-accent-foreground",
          collapsed && "justify-center",
          className,
        )}
        {...props}
      />
    )
  },
)
SidebarMenuButton.displayName = "SidebarMenuButton"

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarToggle,
  SidebarInset,
  SidebarRail,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
}
