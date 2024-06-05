"use client";

import dynamic from "next/dynamic";
import React, { useMemo } from "react";

import "react-quill/dist/quill.bubble.css";

interface ReviewProps {
  onChange: (value: string) => void;
  value: string;
}

export default function Review({ onChange, value }: ReviewProps) {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: true }),
    []
  );

  return <ReactQuill theme="bubble" value={value} readOnly />;
}
