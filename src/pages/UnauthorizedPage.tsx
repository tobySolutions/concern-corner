
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <AlertTriangle size={60} className="text-university-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Access Denied</h1>
        <p className="mb-6 text-gray-700">
          You do not have permission to access this page. If you believe this is a mistake, please contact your administrator.
        </p>
        <div className="space-y-2">
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full"
          >
            Go Back
          </Button>
          <Button 
            onClick={() => navigate("/")}
            className="w-full bg-university-primary hover:bg-university-secondary"
          >
            Return to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
