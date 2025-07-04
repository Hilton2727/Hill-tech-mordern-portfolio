
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const AdminLink = () => {
  const { isAuthenticated } = useAuth();
  
  // Only show the admin link if the user is authenticated
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="fixed bottom-6 left-6 z-[100]">
      <Link to="/admin">
        <Button variant="outline" size="icon" className="rounded-full shadow-md">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Admin</span>
        </Button>
      </Link>
    </div>
  );
};

export default AdminLink;
