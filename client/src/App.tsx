import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/pages/login";
import Setup from "@/pages/setup";
import EmployeeDashboard from "@/pages/employee-dashboard";
import HRDashboard from "@/pages/hr-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/setup" component={Setup} />
      <Route path="/login" component={Login} />
      <Route path="/employee">
        <ProtectedRoute requiredRole="employee">
          <EmployeeDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/hr">
        <ProtectedRoute requiredRole="hr">
          <HRDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/">
        <ProtectedRoute>
          {/* This will redirect based on user role */}
          <div></div>
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
