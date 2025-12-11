import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  id: string;
  title: string;
  date: string;
  tags: string[];
  author: string;
  excerpt: string;
}

const BlogCard = ({ id, title, date, tags, author, excerpt }: BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`} className="group">
      <Card className="h-full card-hover bg-card border-border/40 overflow-hidden">
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
            {title}
          </h3>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
        </CardContent>

        <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {date}
            </span>
            <span className="flex items-center gap-1">
              👤 {author}
            </span>
          </div>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BlogCard;
