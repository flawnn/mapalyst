import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/ui/components/card";

export const MapInterface: React.FC = () => {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-2xl">Map Interface</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        This is where the map interface will be implemented.
      </CardContent>
    </Card>
  );
};
