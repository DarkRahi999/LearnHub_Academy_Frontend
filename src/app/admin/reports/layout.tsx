"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    <div className="flex">
      {/* Sidebar */}
      <div className={`header h-screen rounded-md shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-56' : 'w-16'}`}>
        <div className="flex flex-col">
          <div className="px-2 pt-4 w-full">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <h2 className="text-lg md:text-xl font-semibold text-blue-700">Reports</h2>
              )}
              {sidebarOpen ?
                <Button
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="border bg-white text-blue-800 py-6 [11px] dark:bg-transparent dark:text-blue-200 border-blue-200 hover:bg-blue-200 hover:text-black"
                >
                  <ArrowLeftToLine />
                </Button>
                :
                <Button
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="border bg-white text-blue-600 py-6 w-full dark:bg-transparent dark:text-blue-200 shadow-md hover:shadow-lg hover:bg-blue-50 hover:dark:bg-blue-300/5 hover:border-blue-300"
                >
                  <ArrowRightToLine className="w-[15px]" />
                </Button>}
            </div>
          </div>

          <nav className="flex-1 p-2">
            <ul className="space-y-1">
              {reportNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <li key={item.name}>
                    <Link href={item.href}>
                      <Card className={`p-3 transition-shadow cursor-pointer bg-white text-blue-600 dark:bg-transparent dark:text-blue-200 shadow-md hover:shadow-lg hover:bg-blue-50 hover:dark:bg-blue-300/5 hover:border-blue-300 ${isActive ? 'bg-blue-100 border-blue-300' : 'bg-white'}`}>
                        <div className="flex items-center">
                          <Icon className="h-5 w-5" />
                          {sidebarOpen && (
                            <span className="ml-3">{item.name}</span>
                          )}
                        </div>
                      </Card>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-2 pt-0">
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
          </div>
        </div>
      </div >

      {/* Main Content */}
      <div className="flex-1 pl-6" >
        {children}
      </div >
    </div >
  );
}