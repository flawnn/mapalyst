import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/ui/components/card";

export const ChatInterface: React.FC = () => {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-2xl">Chat Interface</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        This is where the chat interface will be implemented.
      </CardContent>
    </Card>
  );
}; 