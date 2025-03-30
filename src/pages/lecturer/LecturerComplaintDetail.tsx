
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getComplaintById, addMessage, updateComplaintStatus } from "@/services/mockData";
import { Complaint } from "@/types";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Clock, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

const LecturerComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [reply, setReply] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchedComplaint = getComplaintById(id);
      if (fetchedComplaint) {
        setComplaint(fetchedComplaint);
      } else {
        toast({
          title: "Error",
          description: "Complaint not found",
          variant: "destructive",
        });
        navigate("/lecturer-dashboard");
      }
    }
  }, [id, navigate, toast]);

  if (!complaint || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-university-primary"></div>
      </div>
    );
  }

  const handleReplySubmit = () => {
    if (!reply.trim()) {
      toast({
        title: "Error",
        description: "Reply cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedComplaint = addMessage(complaint.id, {
        senderId: user.id,
        senderName: user.name,
        senderRole: "lecturer",
        content: reply,
      });

      if (updatedComplaint) {
        setComplaint(updatedComplaint);
        setReply("");
        toast({
          title: "Reply sent",
          description: "Your reply has been sent successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (status: "pending" | "in-progress" | "resolved") => {
    setIsUpdatingStatus(true);

    try {
      const updatedComplaint = updateComplaintStatus(complaint.id, status);
      if (updatedComplaint) {
        setComplaint(updatedComplaint);
        toast({
          title: "Status updated",
          description: `Complaint status updated to ${status}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" /> In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Resolved
          </Badge>
        );
      default:
        return null;
    }
  };

  const navItems = [
    {
      label: "Dashboard",
      href: "/lecturer-dashboard",
      icon: <FileText className="h-5 w-5" />,
    }
  ];

  return (
    <AuthLayout requiredRole="lecturer">
      <DashboardLayout navItems={navItems}>
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">Complaint Details</h1>
              <p className="text-muted-foreground">
                View and respond to student complaint
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge(complaint.status)}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/lecturer-dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{complaint.title}</CardTitle>
              <CardDescription>
                Reference: {complaint.referenceNumber} • Course: {complaint.courseName} • 
                Student: {complaint.studentName} • 
                Submitted: {new Date(complaint.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-md bg-gray-50 border">
                <p>{complaint.description}</p>
              </div>
              
              <div className="p-4 border rounded-md">
                <h3 className="text-sm font-medium mb-3">Update Status</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-56">
                    <Select 
                      defaultValue={complaint.status}
                      onValueChange={(value) => handleStatusChange(value as "pending" | "in-progress" | "resolved")}
                      disabled={isUpdatingStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {isUpdatingStatus && (
                    <div className="text-sm text-muted-foreground flex items-center">
                      <span className="animate-spin mr-2">◌</span>
                      Updating...
                    </div>
                  )}
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Conversation</h3>
                <div className="space-y-4">
                  {complaint.messages.map((message) => (
                    <div key={message.id} className={`flex ${message.senderRole === "lecturer" ? "justify-end" : ""}`}>
                      <div 
                        className={`max-w-[80%] p-4 rounded-lg ${
                          message.senderRole === "lecturer" 
                            ? "bg-university-accent text-university-dark" 
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-medium">{message.senderName}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <p>{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Reply to Student</h3>
                <Textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your response here..."
                  rows={4}
                />
                <Button
                  className="mt-2 bg-university-primary hover:bg-university-secondary"
                  onClick={handleReplySubmit}
                  disabled={isSubmitting || !reply.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">◌</span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" /> Send Response
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthLayout>
  );
};

export default LecturerComplaintDetail;
