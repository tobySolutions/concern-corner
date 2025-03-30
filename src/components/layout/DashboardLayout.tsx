
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { GraduationCap, LogOut, User, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  }[];
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, navItems }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = React.useState(window.location.pathname);

  const handleNavigation = (href: string) => {
    navigate(href);
    setActiveItem(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center">
            <GraduationCap className="h-6 w-6 text-university-primary mr-2" />
            <h1 className="text-xl font-bold text-university-primary hidden md:block">
              Complaints Management System
            </h1>
          </div>

          <div className="flex items-center">
            {/* Mobile Nav Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px]">
                <div className="py-4">
                  <div className="flex items-center mb-6">
                    <GraduationCap className="h-6 w-6 text-university-primary mr-2" />
                    <h2 className="font-semibold text-university-primary">Complaints System</h2>
                  </div>
                  <nav className="space-y-2">
                    {navItems.map((item) => (
                      <Button
                        key={item.href}
                        variant={activeItem === item.href ? "default" : "ghost"}
                        className={`w-full justify-start ${
                          activeItem === item.href
                            ? "bg-university-accent text-university-primary"
                            : ""
                        }`}
                        onClick={() => {
                          handleNavigation(item.href);
                        }}
                      >
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </Button>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center ml-4">
              <div className="hidden md:block mr-4 text-sm">
                <span className="text-gray-500">Welcome,</span>{" "}
                <span className="font-medium">{user?.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-gray-500 hover:text-gray-700"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 bg-white border-r flex-col">
          <nav className="p-4 flex-1 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className={`w-full justify-start ${
                  activeItem === item.href
                    ? "bg-university-accent text-university-primary"
                    : ""
                }`}
                onClick={() => {
                  handleNavigation(item.href);
                }}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-university-primary text-white flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
