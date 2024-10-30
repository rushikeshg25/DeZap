"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export const RefreshButton = () => {
  const router = useRouter();
  const handleClick = () => {
    router.refresh();
  }
  return (
    <Button
      onClick={handleClick}
      variant={'outline'}
      className="bg-transparent hover:bg-white/5"
    >
      Refresh
    </Button>
  ) 
}