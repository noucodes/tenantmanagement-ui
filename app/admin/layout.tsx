"use client"

import type React from "react"
import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"

// UI Components
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton" // Optional: for loading state
import { cn } from "@/lib/utils"

// Icons
import {
  Building2,
  Users,
  FileText,
  DollarSign,
  BarChart3,
  Settings,
  Home,
  Menu,
  LogOut,
  ChevronUp,
  User,
  PhilippinePeso,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Properties", href: "/admin/properties", icon: Building2 },
  { name: "Tenants", href: "/admin/tenants", icon: Users },
  { name: "Leases", href: "/admin/leases", icon: FileText },
  { name: "Payments", href: "/admin/payments", icon: PhilippinePeso },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
]

interface UserData {
  name: string
  email: string
  avatar?: string
  role: string
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    toast.error("Logged out successfully.")
    router.push("/login")
  }

  function getInitials(name: string) {
    if (!name) return "U"
    const parts = name.trim().split(" ")
    return parts
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join("")
  }

  // ✅ Fetch user details from API
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        handleLogout()
        setIsLoading(false)
        return
      }

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.data.role !== "admin") {
        toast.error("Access denied. Admins only.")
        router.push("/tenant")
        return
      }

      setUser(res.data)
    } catch (err) {
      console.error("Failed to fetch user", err)
      // Optional: Handle token expiration logic here
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
    const interval = setInterval(fetchUser, 30 * 1000)
    return () => clearInterval(interval)
  }, [])

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex h-full flex-col bg-card">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
          <Building2 className="size-4" />
        </div>
        <span className="ml-2 text-lg font-bold tracking-tight">PropertyPro</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => mobile && setSidebarOpen(false)}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* User Section (Footer) */}
      <div className="border-t p-3">
        {isLoading ? (
          <div className="flex items-center space-x-3 px-2 py-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start px-2 py-6 hover:bg-accent"
              >
                <div className="flex items-center gap-3 text-left">
                  <Avatar className="h-9 w-9 border">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    {/* FIXED ERROR: Handled undefined name */}
                    <AvatarFallback>{getInitials(user?.name || "")}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium leading-none">
                      {user?.name || "User"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground mt-1">
                      {user?.email || "No email"}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56" side="right">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )

  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading Layout...</div>}>
      <div className="flex h-screen w-full bg-muted/40">

        {/* Desktop Sidebar */}
        <div className="hidden border-r bg-card lg:block lg:w-72">
          <SidebarContent />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">

          {/* Mobile Header (Only visible on small screens) */}
          <header className="flex h-16 items-center gap-4 border-b bg-card px-6 lg:hidden">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <SidebarContent mobile />
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2 font-bold text-lg">
              <Building2 className="h-6 w-6 text-primary" />
              PropertyPro
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto px-4 lg:px-4">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>

      </div>
    </Suspense>
  )
}