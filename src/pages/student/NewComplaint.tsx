
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getUserCourses, createComplaint } from "@/services/mockData";
import { Course, Complaint, Message } from "@/types";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, FilePlus, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const NewComplaint: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({
    courseId: "",
    title: "",
    description: ""
  });

  useEffect(() => {
    if (user) {
      const userCourses = getUserCourses(user.id);
      setCourses(userCourses);
    }
  }, [user]);

  const validateForm = () => {
    let valid = true;
    const errors = {
      courseId: "",
      title: "",
      description: ""
    };
    
    if (!courseId) {
      errors.courseId = "Please select a course";
      valid = false;
    }
    
    if (!title.trim()) {
      errors.title = "Please enter a title";
      valid = false;
    } else if (title.length < 5) {
      errors.title = "Title must be at least 5 characters";
      valid = false;
    }
    
    if (!description.trim()) {
      errors.description = "Please enter a description";
      valid = false;
    } else if (description.length < 20) {
      errors.description = "Description must be at least 20 characters";
      valid = false;
    }
    
    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a complaint",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const selectedCourse = courses.find(c => c.id === courseId);
    
    if (!selectedCourse) {
      toast({
        title: "Error",
        description: "Selected course not found",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Fixed type issue: Using Message type without id and timestamp
    const initialMessage: Pick<Message, "senderId" | "senderName" | "senderRole" | "content"> = {
      senderId: user.id,
      senderName: user.name,
      senderRole: "student",
      content: description,
    };
    
    const newComplaint: Omit<Complaint, "id" | "referenceNumber" | "createdAt" | "updatedAt"> = {
      studentId: user.id,
      studentName: user.name,
      courseId: selectedCourse.id,
      courseName: selectedCourse.name,
      title,
      description,
      status: "pending",
      messages: [initialMessage as any], // Type assertion to prevent TS error
    };
    
    try {
      const createdComplaint = createComplaint(newComplaint);
      
      toast({
        title: "Complaint submitted",
        description: `Your complaint has been submitted with reference number: ${createdComplaint.referenceNumber}`,
      });
      
      navigate("/student-dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit complaint",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
          <div>
            <h1 className="text-2xl font-bold">Submit a New Complaint</h1>
            <p className="text-muted-foreground">
              Fill in the details below to submit your complaint
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Complaint Details</CardTitle>
              <CardDescription>
                Provide information about your complaint
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Select value={courseId} onValueChange={setCourseId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.code} - {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.courseId && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.courseId}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief title of your complaint"
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about your complaint"
                    rows={5}
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
                  )}
                </div>

                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">Important Notice</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Once submitted, your complaint will be sent to the course lecturer. You will be notified of any updates.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/student-dashboard")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-university-primary hover:bg-university-secondary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">◌</span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Complaint"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </DashboardLayout>
    </AuthLayout>
  );
};

export default NewComplaint;
