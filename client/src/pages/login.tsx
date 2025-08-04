import { useState } from "react";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Building, User, UserCheck, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Login() {
  const { user, login, loading } = useAuth();
  const { toast } = useToast();
  const [loginType, setLoginType] = useState<"employee" | "hr">("employee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (user && !loading) {
    return <Redirect to={user.role === "hr" ? "/hr" : "/employee"} />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="text-white text-2xl" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">HR Leave Portal</h1>
            <p className="text-gray-600 mt-2">Sign in to manage your leave requests</p>
          </div>

          <div className="mb-6">
            <Label className="block text-sm font-medium text-gray-700 mb-3">Login as:</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={loginType === "employee" ? "default" : "outline"}
                onClick={() => setLoginType("employee")}
                className={cn(
                  "p-3 flex items-center justify-center space-x-2 transition-all",
                  loginType === "employee"
                    ? "bg-primary text-white border-primary"
                    : "border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
                )}
              >
                <User size={16} />
                <span className="font-medium">Employee</span>
              </Button>
              <Button
                type="button"
                variant={loginType === "hr" ? "default" : "outline"}
                onClick={() => setLoginType("hr")}
                className={cn(
                  "p-3 flex items-center justify-center space-x-2 transition-all",
                  loginType === "hr"
                    ? "bg-primary text-white border-primary"
                    : "border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
                )}
              >
                <UserCheck size={16} />
                <span className="font-medium">HR</span>
              </Button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@company.com"
                required
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium mt-6 hover:bg-blue-700 transition-all transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-200"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <a href="#" className="text-primary font-medium hover:underline">
                Contact HR
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
