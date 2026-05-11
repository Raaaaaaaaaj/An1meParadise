import React from "react";

export default function Loader({ message = "Processing..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex flex-col items-center gap-4 rounded-lg bg-card p-6">
        <div className="flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
        <div className="text-center">
          <p className="font-medium text-primary">{message}</p>
          <p className="text-sm text-muted-foreground">Please do not close this window.</p>
        </div>
      </div>
    </div>
  );
}
