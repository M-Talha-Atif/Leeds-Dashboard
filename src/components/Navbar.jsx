"use client"

import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export default function ImpressiveNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { title: "Dashboard", href: "/", description: "Overview and key metrics" },
    {
      title: "Summary",
      href: "/summary",
      description: "Detailed performance insights",
    },
    { title: "LEED Communities", href: "/reports", description: "Generate and view reports" },
  ]

  return (
    <>
      {/* Animated background gradient */}
      <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-green-500/20 blur-3xl -z-10 animate-pulse" />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-slate-900/95 backdrop-blur-xl shadow-2xl border-b border-slate-700/50"
            : "bg-slate-900/80 backdrop-blur-md border-b border-slate-800/30"
        }`}
      >
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-green-400 animate-gradient-x" />

        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="group flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-400 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-110">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-300 bg-clip-text text-transparent">
                  LEED Dashboard
                </h1>
                <p className="text-xs text-slate-400 -mt-1">Sustainability Platform</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <NavigationMenu>
                <NavigationMenuList>
                  {navItems.map((item) => (
                    <NavigationMenuItem key={item.title}>
                      {item.items ? (
                        <>
                          <NavigationMenuTrigger className="bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white transition-all duration-200">
                            {item.title}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <div className="grid w-[400px] gap-3 p-4">
                              <div className="row-span-3">
                                <NavigationMenuLink asChild>
                                  <Link
                                    to={item.href}
                                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-slate-800 to-slate-900 p-6 no-underline outline-none focus:shadow-md hover:shadow-lg transition-all duration-200"
                                  >
                                    <div className="mb-2 mt-4 text-lg font-medium text-white">{item.title}</div>
                                    <p className="text-sm leading-tight text-slate-400">{item.description}</p>
                                  </Link>
                                </NavigationMenuLink>
                              </div>
                              <div className="grid gap-2">
                                {item.items.map((subItem) => (
                                  <NavigationMenuLink key={subItem.title} asChild>
                                    <Link
                                      to={subItem.href}
                                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-800/50 hover:text-white focus:bg-slate-800/50 focus:text-white"
                                    >
                                      <div className="text-sm font-medium leading-none text-slate-300">
                                        {subItem.title}
                                      </div>
                                    </Link>
                                  </NavigationMenuLink>
                                ))}
                              </div>
                            </div>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-slate-800/50 hover:text-white"
                          >
                            {item.title}
                          </Link>
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-slate-800/50">
                    <Menu className="w-6 h-6 text-slate-300" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-slate-900 border-slate-700">
                  <SheetHeader>
                    <SheetTitle className="text-left text-slate-200">Navigation</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {navItems.map((item) => (
                      <div key={item.title} className="space-y-2">
                        <Link
                          to={item.href}
                          className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-md transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.title}
                        </Link>
                        {item.items && (
                          <div className="ml-4 space-y-1">
                            {item.items.map((subItem) => (
                              <Link
                                key={subItem.title}
                                to={subItem.href}
                                className="block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/30 rounded-md transition-colors"
                                onClick={() => setMobileOpen(false)}
                              >
                                {subItem.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <div className="h-16" />
    </>
  )
}
