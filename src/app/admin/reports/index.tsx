"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/interface/user";
import { BarChart3, FileText, Users, Download, Filter } from "lucide-react";

export default function ReportsIndexPage() {
  return (
    <RoleGuard 
      allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}
      fallback={
        <div className="container mx-auto py-8">
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">Access denied. Admin privileges required.</p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <div className="container mx-auto py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Reports Dashboard</h1>
          <p className="text-gray-600">Access and manage all system reports</p>
        </div>

        {/* Report Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Full Dashboard */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Full Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                View comprehensive analytics and performance metrics
              </p>
              <Button asChild>
                <a href="/admin/reports/dashboard">View Dashboard</a>
              </Button>
            </CardContent>
          </Card>

          {/* Report Management */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <Filter className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Report Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Manage, filter, and export detailed reports
              </p>
              <Button asChild>
                <a href="/admin/reports/management">Manage Reports</a>
              </Button>
            </CardContent>
          </Card>

          {/* Exam Statistics */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <FileText className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Exam Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Analyze individual exam performance data
              </p>
              <Button asChild variant="outline">
                <a href="/admin/reports/dashboard">View Statistics</a>
              </Button>
            </CardContent>
          </Card>

          {/* User Performance */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <Users className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>User Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Track individual user progress and results
              </p>
              <Button asChild variant="outline">
                <a href="/admin/reports/dashboard">View Performance</a>
              </Button>
            </CardContent>
          </Card>

          {/* Export Reports */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <Download className="h-8 w-8 text-red-600 mb-2" />
              <CardTitle>Export Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Export data in various formats for analysis
              </p>
              <Button asChild variant="outline">
                <a href="/admin/reports/export">Export Data</a>
              </Button>
            </CardContent>
          </Card>

          {/* Custom Reports */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-indigo-600 mb-2" />
              <CardTitle>Custom Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Create custom reports with specific filters
              </p>
              <Button asChild variant="outline">
                <a href="/admin/reports/dashboard">Create Report</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}