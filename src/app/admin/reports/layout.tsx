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
      <div className={`bg-gray-50 border-r transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <h2 className="text-lg font-semibold">Reports</h2>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? '«' : '»'}
              </Button>
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
                      <Card className={`p-3 hover:shadow-md transition-shadow cursor-pointer ${isActive ? 'bg-blue-100 border-blue-500' : 'bg-white'}`}>
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
          
          <div className="p-4 border-t">
            <Link href="/admin">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {sidebarOpen ? 'Back to Admin' : 'Admin'}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}