import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getComplaints, initializeLocalStorage } from "@/services/mockData";
import { Complaint } from "@/types";
import { FileText, Clock, CheckCircle2, AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const LecturerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const loadComplaints = () => {
    if (user) {
      console.log(`Fetching complaints for lecturer: ${user.id}`);
      const lecturerComplaints = getComplaints(user.id, user.role);
      console.log(`Found ${lecturerComplaints.length} complaints for lecturer`);
      setComplaints(lecturerComplaints);
    }
  };

  useEffect(() => {
    initializeLocalStorage();
    loadComplaints();
    
    const intervalId = setInterval(loadComplaints, 5000);
    return () => clearInterval(intervalId);
  }, [user]);

  const getFilteredComplaints = () => {
    let filtered = complaints;
    
    if (activeTab !== "all") {
      filtered = filtered.filter((complaint) => complaint.status === activeTab);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((complaint) => 
        complaint.title.toLowerCase().includes(query) || 
        complaint.description.toLowerCase().includes(query) || 
        complaint.studentName.toLowerCase().includes(query) ||
        complaint.referenceNumber.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "in-progress":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Resolved
          </Badge>
        );
      default:
        return null;
    }
  };

  const getCounts = () => {
    return {
      all: complaints.length,
      pending: complaints.filter((c) => c.status === "pending").length,
      "in-progress": complaints.filter((c) => c.status === "in-progress").length,
      resolved: complaints.filter((c) => c.status === "resolved").length,
    };
  };

  const counts = getCounts();
  const filteredComplaints = getFilteredComplaints();

  const navItems = [
    {
      label: "Dashboard",
      href: "/lecturer-dashboard",
      icon: <FileText className="h-5 w-5" />,
    }
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    loadComplaints();
  };

  return (
    <AuthLayout requiredRole="lecturer">
      <DashboardLayout navItems={navItems}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Lecturer Dashboard</h1>
            <p className="text-muted-foreground">
              View and manage student complaints for your courses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Complaints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{counts.all}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-500">{counts.pending}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500">{counts["in-progress"]}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Resolved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">{counts.resolved}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Student Complaints</CardTitle>
              <CardDescription>
                View and manage complaints from students in your courses
              </CardDescription>
              <Button 
                variant="outline" 
                className="mt-2" 
                onClick={loadComplaints}
              >
                Refresh Complaints
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search complaints..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Tabs defaultValue="all" onValueChange={handleTabChange}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">
                    All ({counts.all})
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending ({counts.pending})
                  </TabsTrigger>
                  <TabsTrigger value="in-progress">
                    In Progress ({counts["in-progress"]})
                  </TabsTrigger>
                  <TabsTrigger value="resolved">
                    Resolved ({counts.resolved})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                  {filteredComplaints.length > 0 ? (
                    <div className="space-y-4">
                      {filteredComplaints.map((complaint) => (
                        <div
                          key={complaint.id}
                          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => navigate(`/lecturer-complaint/${complaint.id}`)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                {getStatusIcon(complaint.status)}
                                <h3 className="text-lg font-medium ml-2">
                                  {complaint.title}
                                </h3>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {complaint.courseName} • Student: {complaint.studentName} • Ref: {complaint.referenceNumber}
                              </p>
                            </div>
                            <div className="flex flex-col items-end">
                              {getStatusBadge(complaint.status)}
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(complaint.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {complaint.description}
                          </p>
                          <div className="mt-3 flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/lecturer-complaint/${complaint.id}`);
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">
                        No complaints found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchQuery 
                          ? "No complaints match your search criteria"
                          : "You don't have any complaints in this category yet"}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthLayout>
  );
};

export default LecturerDashboard;
