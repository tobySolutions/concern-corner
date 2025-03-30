
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { GraduationCap, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { initializeLocalStorage } from "@/services/mockData";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Initialize mock data when the login page loads
  useEffect(() => {
    console.log("LoginPage: Initializing mock data");
    initializeLocalStorage();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    console.log(`Attempting to log in with: ${email}`);
    try {
      const success = await login(email, password);
      if (!success) {
        toast.error("Invalid credentials. Please check your email and password.");
      } else {
        console.log("Login successful, redirecting...");
      }
      // Redirect will happen automatically through useEffect if successful
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      console.log(`User authenticated as ${user?.role}, redirecting...`);
      if (user?.role === "student") {
        navigate("/student-dashboard");
      } else if (user?.role === "lecturer") {
        navigate("/lecturer-dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-university-dark to-black flex flex-col justify-center items-center p-4">
      <div className="flex items-center mb-8">
        <GraduationCap size={40} className="text-university-light mr-2" />
        <h1 className="text-3xl font-bold text-university-light">University Complaints Management System</h1>
      </div>
      
      <Card className="w-full max-w-md shadow-lg border-university-secondary/30 bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@university.edu"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <p className="text-xs text-muted-foreground">
                (For demo: any password will work with demo emails)
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-university-primary hover:bg-university-secondary"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <span className="animate-spin mr-2">◌</span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        <div className="p-4 border rounded-md bg-card border-university-secondary/30">
          <div className="flex items-center mb-2">
            <BookOpen size={16} className="mr-1 text-university-light" />
            <span className="font-semibold">Student Accounts</span>
          </div>
          <p>john@university.edu</p>
          <p>jane@university.edu</p>
          <p>alex@university.edu</p>
          <p>sarah@university.edu</p>
          <p>michael@university.edu</p>
          <p className="text-xs mt-1 text-muted-foreground">(any password)</p>
        </div>
        <div className="p-4 border rounded-md bg-card border-university-secondary/30">
          <div className="flex items-center mb-2">
            <GraduationCap size={16} className="mr-1 text-university-light" />
            <span className="font-semibold">Lecturer Accounts</span>
          </div>
          <p>rbrown@university.edu</p>
          <p>ewhite@university.edu</p>
          <p>jsmith@university.edu</p>
          <p>lchen@university.edu</p>
          <p className="text-xs mt-1 text-muted-foreground">(any password)</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
