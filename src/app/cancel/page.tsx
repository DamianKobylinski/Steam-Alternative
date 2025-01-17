"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { X } from "lucide-react";
import { redirect } from "next/navigation";

const Cancel = () => {
  const user_information = useUser();
  if (user_information && user_information.user === null) {
    redirect("/");
  }

  return (
    <div className="flex flex-col h-screen place-content-center items-center">
      <div className="flex flex-col place-items-center gap-5">
        <X className="text-red-500" size={64} />
        <h1>Payment Cancel</h1>
        <p>Payment has been canceled</p>
        <Button variant={"default"} onClick={() => redirect("/")}>
          Wróć do strony głównej
        </Button>
      </div>
    </div>
  );
};

export default Cancel;
