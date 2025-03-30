
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";

// Pages
import LoginPage from "./pages/LoginPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import NewComplaint from "./pages/student/NewComplaint";
import StudentComplaintDetail from "./pages/student/ComplaintDetail";
import LecturerDashboard from "./pages/lecturer/LecturerDashboard";
import LecturerComplaintDetail from "./pages/lecturer/LecturerComplaintDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Default route redirects to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Authentication routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              
              {/* Student routes */}
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/student-new-complaint" element={<NewComplaint />} />
              <Route path="/student-complaint/:id" element={<StudentComplaintDetail />} />
              
              {/* Lecturer routes */}
              <Route path="/lecturer-dashboard" element={<LecturerDashboard />} />
              <Route path="/lecturer-complaint/:id" element={<LecturerComplaintDetail />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
