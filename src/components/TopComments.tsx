import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Feedback {
  id: string;
  name: string | null;
  subject: string;
  faculty_name: string;
  rating: number;
  comments: string | null;
  is_anonymous: boolean;
}

interface TopCommentsProps {
  feedbackData: Feedback[];
}

export const TopComments = ({ feedbackData }: TopCommentsProps) => {
  const feedbackWithComments = feedbackData.filter((f) => f.comments && f.comments.trim() !== "");

  const positiveComments = feedbackWithComments
    .filter((f) => f.rating >= 4)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const negativeComments = feedbackWithComments
    .filter((f) => f.rating <= 2)
    .sort((a, b) => a.rating - b.rating)
    .slice(0, 3);

  const CommentCard = ({ feedback, isPositive }: { feedback: Feedback; isPositive: boolean }) => (
    <div className="p-4 rounded-lg border bg-card space-y-2">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${isPositive ? "bg-success/10" : "bg-destructive/10"}`}>
          {isPositive ? (
            <ThumbsUp className="h-4 w-4 text-success" />
          ) : (
            <ThumbsDown className="h-4 w-4 text-destructive" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-sm text-foreground">{feedback.comments}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {feedback.subject}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {feedback.faculty_name}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {feedback.is_anonymous ? "Anonymous" : feedback.name || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ThumbsUp className="h-5 w-5 text-success" />
            Top Positive Feedback
          </CardTitle>
          <CardDescription>Highest rated comments from students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {positiveComments.length > 0 ? (
            positiveComments.map((feedback) => (
              <CommentCard key={feedback.id} feedback={feedback} isPositive={true} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No positive comments yet</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ThumbsDown className="h-5 w-5 text-destructive" />
            Areas for Improvement
          </CardTitle>
          <CardDescription>Feedback that needs attention</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {negativeComments.length > 0 ? (
            negativeComments.map((feedback) => (
              <CommentCard key={feedback.id} feedback={feedback} isPositive={false} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No negative comments yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
