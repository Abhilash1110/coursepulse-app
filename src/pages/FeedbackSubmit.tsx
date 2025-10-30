import { FeedbackForm } from "@/components/FeedbackForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const FeedbackSubmit = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Student Feedback</h1>
          <p className="text-muted-foreground text-lg">Your voice matters! Share your course experience</p>
        </div>

        <FeedbackForm />
      </div>
    </div>
  );
};

export default FeedbackSubmit;
