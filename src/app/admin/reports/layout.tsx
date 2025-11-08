"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { viewportAnimation } from "@/lib/utils";
import {
  BarChart3,
  Users,
  Download,
  Filter,
  Home,
  ArrowLeft,
  UserCheck,
  ArrowRightToLine,
  ArrowLeftToLine,
} from "lucide-react";

const reportNavItems = [
  { name: "Dashboard", href: "/admin/reports/dashboard", icon: Home },
  { name: "Management", href: "/admin/reports/management", icon: Filter },
  { name: "Statistics", href: "/admin/reports/statistics", icon: BarChart3 },
  { name: "Participation", href: "/admin/reports/participation", icon: UserCheck },
  { name: "User Performance", href: "/admin/reports/user-performance", icon: Users },
  { name: "Export", href: "/admin/reports/export", icon: Download },
];

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:ml-2 md:flex-row gap-2 h-90vh md:h-[calc(100vh-6rem)]">
      {/* Sidebar Backdrop - Visible when sidebar is open on mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300 md:hidden ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        onClick={() => setSidebarOpen(false)}
      />
      
      {/* Sidebar - Mobile responsive */}
      <motion.div
        className={`header rounded-md border border-gray-200 dark:border-blue-200/40 shadow-lg transition-all duration-300 flex flex-col md:static fixed z-50 md:z-auto ${sidebarOpen ? 'w-[90%] sm:w-[42%] md:w-56' : 'w-16'
          } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} md:translate-x-0`}
        {...viewportAnimation(0.1, 20)}
        style={{
          top: '3rem',
          height: 'calc(100vh - 6rem)',
          maxHeight: 'calc(100vh - 4rem)'
        }}
      >
        <div className="flex flex-col flex-1">
          <div className="px-2 pt-4 w-full">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <motion.h2
                  className="text-3xl pl-2 text-blue-200 md:text-2xl font-semibold md:text-blue-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  Reports
                </motion.h2>
              )}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex justify-end"
              >
                {sidebarOpen ?
                  <Button
                    size="sm"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="border bg-white text-blue-800 py-6 dark:bg-transparent dark:text-blue-200 border-blue-200 hover:bg-blue-200 hover:text-black"
                  >
                    <ArrowLeftToLine />
                  </Button>
                  :
                  <Button
                    size="sm"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="border w-full bg-white text-blue-600 py-6 px-20 dark:bg-transparent dark:text-blue-200 shadow-md hover:shadow-lg hover:bg-blue-50 hover:dark:bg-blue-300/5 hover:border-blue-300"
                  >
                    <ArrowRightToLine className="" />
                  </Button>}
              </motion.div>
            </div>
          </div>

          <nav className="flex-1 p-2 md:overflow-y-auto overflow-hidden">
            <ul className="space-y-1">
              {reportNavItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <motion.li
                    key={item.name}
                    {...viewportAnimation(0.1 * index, 10)}
                    whileHover={{ x: 5 }}
                  >
                    <Link href={item.href}>
                      <Card className={`p-3 transition-shadow cursor-pointer bg-white text-blue-600 dark:bg-transparent dark:text-blue-200 shadow-md hover:shadow-lg hover:bg-blue-50 hover:dark:bg-blue-300/5 hover:border-blue-300 ${isActive ? 'bg-blue-100 border-blue-300' : 'bg-white'}`}>
                        <div className="flex items-center">
                          <Icon className="h-5 w-5" />
                          {sidebarOpen && (
                            <motion.span
                              {...viewportAnimation(0.1 * index + 0.1, 5)}
                              className="ml-2"
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </div>
                      </Card>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* Moved the back button to the bottom */}
          <motion.div
            {...viewportAnimation(0.3, 10)}
            className="p-2 pt-0 mt-auto"
          >
            <Link href="/admin">
              {sidebarOpen ?
                <Button
                  className="border bg-white text-blue-600 py-6 w-full dark:bg-transparent dark:text-blue-200 shadow-md hover:shadow-lg hover:bg-blue-50 hover:dark:bg-blue-300/5 hover:border-blue-300 ">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admin
                </Button>
                :
                <Button
                  className="border bg-white shadow-md text-blue-600 py-6 w-full dark:bg-transparent dark:text-blue-200 hover:shadow-lg hover:bg-blue-50 hover:dark:bg-blue-300/5 hover:border-blue-300 ">
                  <ArrowLeft className="" />
                </Button>}
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile sidebar toggle button */}
      {sidebarOpen ? <></>
        : 
        <div className="md:hidden fixed top-12 left-[-12px] z-10">
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            variant="outline"
            className="w-[35px] flex justify-between rounded-lg shadow-lg text-blue-300 bg-blue-150 dark:bg-slate-900 dark:border-blue-200/40"
          >
            <ArrowRightToLine />
          </Button>
        </div>
      }

      {/* Main Content - Made scrollable with proper overflow handling */}
      <motion.div
        className="flex-1 md:h-[calc(100vh-6rem)] md:pl-6 md:border md:border-gray-200 md:shadow-lg md:dark:border-blue-200/40 md:rounded-md overflow-hidden"
        {...viewportAnimation(0.2, 20)}
      >
        <div className="h-full md:overflow-y-auto overflow-hidden md:pb-4 pt-2 md:pr-4">
          {children}
        </div>
      </motion.div>
    </div>
  );
}