"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex gap-2 h-[86vh]">
      {/* Sidebar */}
      <motion.div 
        className={`header rounded-md border border-gray-200 dark:border-blue-200/40 shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-56' : 'w-16'} flex flex-col`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col flex-1">
          <div className="px-2 pt-4 w-full">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <motion.h2 
                  className="text-lg md:text-xl font-semibold text-blue-700"
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

          <nav className="flex-1 p-2 overflow-y-auto">
            <ul className="space-y-1">
              {reportNavItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <motion.li 
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ x: 5 }}
                  >
                    <Link href={item.href}>
                      <Card className={`p-3 transition-shadow cursor-pointer bg-white text-blue-600 dark:bg-transparent dark:text-blue-200 shadow-md hover:shadow-lg hover:bg-blue-50 hover:dark:bg-blue-300/5 hover:border-blue-300 ${isActive ? 'bg-blue-100 border-blue-300' : 'bg-white'}`}>
                        <div className="flex items-center">
                          <Icon className="h-5 w-5" />
                          {sidebarOpen && (
                            <motion.span 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.1 * index + 0.1 }}
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
            className="p-2 pt-0 mt-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
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

      {/* Main Content - Made scrollable */}
      <motion.div 
        className="flex-1 pl-6 pr-4 overflow-y-auto border border-gray-200 shadow-lg dark:border-blue-200/40 rounded-md"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  );
}