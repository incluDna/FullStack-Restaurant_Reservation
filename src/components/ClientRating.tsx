'use client'
import { Rating } from "@mui/material";
import { useEffect, useState } from "react";

export default function ClientRating({ rating }: { rating: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <Rating readOnly defaultValue={rating} size='large'/>;
}
