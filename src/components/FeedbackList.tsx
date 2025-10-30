import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star, User, Calendar } from "lucide-react";
import { format } from "date-fns";

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

interface FeedbackListProps {
  feedbackData: Feedback[];
}

export const FeedbackList = ({ feedbackData }: FeedbackListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterFaculty, setFilterFaculty] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");

  const subjects = Array.from(new Set(feedbackData.map((f) => f.subject)));
  const faculties = Array.from(new Set(feedbackData.map((f) => f.faculty_name)));
  const departments = Array.from(new Set(feedbackData.map((f) => f.department)));

  const filteredFeedback = feedbackData.filter((feedback) => {
    const matchesSearch =
      searchTerm === "" ||
      feedback.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.roll_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.comments?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject = filterSubject === "all" || feedback.subject === filterSubject;
    const matchesFaculty = filterFaculty === "all" || feedback.faculty_name === filterFaculty;
    const matchesDepartment = filterDepartment === "all" || feedback.department === filterDepartment;

    return matchesSearch && matchesSubject && matchesFaculty && matchesDepartment;
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-success text-success-foreground";
    if (rating >= 3) return "bg-accent text-accent-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Feedback</CardTitle>
        <CardDescription>Browse and filter feedback submissions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Search by name, roll number, or comment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterFaculty} onValueChange={setFilterFaculty}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by faculty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Faculty</SelectItem>
              {faculties.map((faculty) => (
                <SelectItem key={faculty} value={faculty}>
                  {faculty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {filteredFeedback.length} of {feedbackData.length} feedback submissions
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {filteredFeedback.map((feedback) => (
            <Card key={feedback.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getRatingColor(feedback.rating)}>
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        {feedback.rating}/5
                      </Badge>
                      <Badge variant="outline">{feedback.subject}</Badge>
                      <Badge variant="secondary">{feedback.faculty_name}</Badge>
                      <Badge variant="outline">{feedback.department}</Badge>
                    </div>

                    {feedback.comments && (
                      <p className="text-sm text-muted-foreground mt-2">{feedback.comments}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {feedback.is_anonymous ? "Anonymous" : feedback.name || "N/A"}
                      </span>
                      {!feedback.is_anonymous && feedback.roll_number && (
                        <span>Roll: {feedback.roll_number}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(feedback.created_at), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
