
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getComplaintById, addMessage, deleteComplaint } from "@/services/mockData";
import { Complaint } from "@/types";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { FileText, FilePlus, Clock, CheckCircle2, AlertCircle, Send, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

const StudentComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [reply, setReply] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        navigate("/student-dashboard");
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
        senderRole: "student",
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

  const handleDeleteComplaint = () => {
    try {
      const deleted = deleteComplaint(complaint.id);
      if (deleted) {
        navigate("/student-dashboard");
      } else {
        toast({
          title: "Error",
          description: "Failed to delete complaint",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the complaint",
        variant: "destructive",
      });
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
      href: "/student-dashboard",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: "New Complaint",
      href: "/student-new-complaint",
      icon: <FilePlus className="h-5 w-5" />,
    },
  ];

  return (
    <AuthLayout requiredRole="student">
      <DashboardLayout navItems={navItems}>
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">Complaint Details</h1>
              <p className="text-muted-foreground">
                View and manage your complaint
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge(complaint.status)}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/student-dashboard")}
              >
                Back to Dashboard
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your complaint
                      and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteComplaint} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{complaint.title}</CardTitle>
              <CardDescription>
                Reference: {complaint.referenceNumber} • Course: {complaint.courseName} • 
                Submitted: {new Date(complaint.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-md bg-gray-50 border">
                <p>{complaint.description}</p>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Conversation</h3>
                <div className="space-y-4">
                  {complaint.messages.map((message, index) => (
                    <div key={message.id} className={`flex ${message.senderRole === "student" ? "justify-end" : ""}`}>
                      <div 
                        className={`max-w-[80%] p-4 rounded-lg ${
                          message.senderRole === "student" 
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
              
              {complaint.status !== "resolved" && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Reply</h3>
                  <Textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your reply here..."
                    rows={3}
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
                        <Send className="h-4 w-4 mr-2" /> Send Reply
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              {complaint.status === "resolved" && (
                <div className="bg-green-50 p-4 rounded-md border border-green-200">
                  <div className="flex">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-green-800">Complaint Resolved</h4>
                      <p className="text-sm text-green-700 mt-1">
                        This complaint has been marked as resolved. If you still have issues, you can submit a new complaint.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthLayout>
  );
};

export default StudentComplaintDetail;
