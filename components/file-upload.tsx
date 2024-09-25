"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FileIcon, X } from "lucide-react";

import { UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const [fileType, setFileType] = useState<string>("");
  if (value && !fileType.includes("pdf")) {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="Upload" className="rounded-full" />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType.includes("pdf")) {
    return (
      <div className="relative flex items-center mt-2 rounded-md bg-gray-200 px-3 py-4 gap-x-2">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <Link
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-indigo-500 dark:text-indigo-400 hover:underline inline-block max-w-sm break-words whitespace-norma py-2 mr-2"
        >
          {value}
        </Link>
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        setFileType(res?.[0]?.type);
        onChange(res?.[0]?.url);
      }}
      onUploadError={(error: Error) => {
        console.error(error);
      }}
    />
  );
};
