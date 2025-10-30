import { useEffect, useState } from "react";
import { SummaryCard } from "@/components/SummaryCard";
import { DashboardCharts } from "@/components/DashboardCharts";
import { FeedbackList } from "@/components/FeedbackList";
import { TopComments } from "@/components/TopComments";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Star, Award, BookOpen, Download, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Feedback {
  id: string;
  name: string | null;
  roll_number: string | null;
  department: string;
  subject: string;
  faculty_name: string;
  rating: number;
  comments: string | null;
  is_anonymous: boolean;
  created_at: string;
}

const Index = () => {
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFeedbackData(data || []);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast.error("Failed to load feedback data");
    } finally {
      setIsLoading(false);
    }
  };

  const totalFeedback = feedbackData.length;
  const avgRating = feedbackData.length > 0
    ? (feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length).toFixed(1)
    : "0";

  const facultyRatings = feedbackData.reduce((acc, f) => {
    if (!acc[f.faculty_name]) {
      acc[f.faculty_name] = { total: 0, count: 0 };
    }
    acc[f.faculty_name].total += f.rating;
    acc[f.faculty_name].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const bestFaculty = Object.keys(facultyRatings).length > 0
    ? Object.entries(facultyRatings).sort((a, b) => b[1].total / b[1].count - a[1].total / a[1].count)[0][0]
    : "N/A";

  const subjectCounts = feedbackData.reduce((acc, f) => {
    acc[f.subject] = (acc[f.subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostRatedSubject = Object.keys(subjectCounts).length > 0
    ? Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])[0][0]
    : "N/A";

  const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
    rating,
    count: feedbackData.filter((f) => f.rating === rating).length,
  }));

  const subjectRatings = Object.keys(
    feedbackData.reduce((acc, f) => {
      acc[f.subject] = true;
      return acc;
    }, {} as Record<string, boolean>)
  ).map((subject) => {
    const subjectFeedback = feedbackData.filter((f) => f.subject === subject);
    const avgRating = subjectFeedback.reduce((sum, f) => sum + f.rating, 0) / subjectFeedback.length;
    return { subject, avgRating: Number(avgRating.toFixed(1)) };
  });

  const exportToCSV = () => {
    const headers = ["Name", "Roll Number", "Department", "Subject", "Faculty", "Rating", "Comments", "Date"];
    const rows = feedbackData.map((f) => [
      f.is_anonymous ? "Anonymous" : f.name || "N/A",
      f.is_anonymous ? "N/A" : f.roll_number || "N/A",
      f.department,
      f.subject,
      f.faculty_name,
      f.rating,
      f.comments || "N/A",
      new Date(f.created_at).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feedback-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Feedback exported successfully!");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Feedback Dashboard</h1>
            <p className="text-muted-foreground text-lg mt-2">Track and analyze student feedback</p>
          </div>
          <div className="flex gap-2">
            <Link to="/submit">
              <Button size="lg" className="gap-2">
                <PlusCircle className="h-5 w-5" />
                Submit Feedback
              </Button>
            </Link>
            <Button variant="outline" size="lg" onClick={exportToCSV} className="gap-2">
              <Download className="h-5 w-5" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            title="Total Responses"
            value={totalFeedback}
            icon={MessageSquare}
            description="Feedback received"
          />
          <SummaryCard
            title="Average Rating"
            value={avgRating}
            icon={Star}
            description="Out of 5 stars"
          />
          <SummaryCard
            title="Best Rated Faculty"
            value={bestFaculty}
            icon={Award}
            description="Highest average rating"
          />
          <SummaryCard
            title="Most Rated Subject"
            value={mostRatedSubject}
            icon={BookOpen}
            description="Most feedback received"
          />
        </div>

        <DashboardCharts ratingDistribution={ratingDistribution} subjectRatings={subjectRatings} />

        <TopComments feedbackData={feedbackData} />

        <FeedbackList feedbackData={feedbackData} />
      </div>
    </div>
  );
};

export default Index;
