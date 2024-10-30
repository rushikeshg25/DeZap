'use client';
import { useState } from "react";
import Icon from "./ui/icon";

export const Copy = ({value}:{value:string}) =>{
    const [isCopied, setIsCopied] = useState(false);
    const handleCopy = () => {
      if (isCopied) return;
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
      navigator.clipboard.writeText(value);
    };
  return (
    <button onClick={handleCopy}>
      {!isCopied && <Icon icon="copy" className="text-primary/70" />}
      {isCopied && <Icon icon="check" className="text-green-400" />}
    </button>
  )
} 