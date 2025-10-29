"use client";

import { useState } from "react";
import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/interface/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BookOpen } from "lucide-react";
import { QuestionForm } from "@/components/feature/question-form";
import { useToast } from "@/hooks/use-toast";
import { TabbedHierarchyManager } from "@/components/feature/tabbed-hierarchy-manager";
import { Permission } from "@/interface/permission";

export default function QuestionsManagementPage() {
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleQuestionCreated = () => {
    setShowCreateForm(false);
    toast({
      title: "Success",
      description: "Question created successfully",
    });
  };

  const handleCancel = () => {
    setShowCreateForm(false);
  };

  return (
    <RoleGuard
      allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}
      requiredPermissions={[
        Permission.CREATE_QUESTION,
        Permission.UPDATE_QUESTION,
        Permission.DELETE_QUESTION,
      ]}
    >
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Question Management</h1>
            <p className="text-gray-600">Manage all questions in the system</p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="w-4 h-4 mr-2" />
            {showCreateForm ? "Cancel" : "Add New Question"}
          </Button>
        </div>

        {showCreateForm && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Create New Question</CardTitle>
              </CardHeader>
              <CardContent>
                <QuestionForm 
                  onSuccess={handleQuestionCreated}
                  onCancel={handleCancel}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabbed Hierarchy Manager for browsing and managing questions */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>Question Hierarchy</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TabbedHierarchyManager />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}