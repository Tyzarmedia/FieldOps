import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <Construction className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">{description}</p>
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
