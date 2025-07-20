"use client";

import { useState, useRef } from "react";
import {
  Upload,
  Video,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface UploadProgress {
  stage: "idle" | "uploading" | "processing" | "complete" | "error";
  progress: number;
  message: string;
}

export function VideoUpload({ isOpen, onClose, onSuccess }: VideoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    stage: "idle",
    progress: 0,
    message: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      setUploadProgress({
        stage: "error",
        progress: 0,
        message: "Please select a valid video file",
      });
      return;
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setUploadProgress({
        stage: "error",
        progress: 0,
        message: "File size must be less than 50MB",
      });
      return;
    }

    setSelectedFile(file);
    setUploadProgress({ stage: "idle", progress: 0, message: "" });

    // Create preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      const event = {
        target: { files: [file] },
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(event);
    }
  };

  const uploadToImageKit = async (file: File): Promise<string> => {
    // Get auth parameters from backend
    const authResponse = await apiClient.get("/api/upload-auth");
    const { authenticParameters, publicKey, urlEndpoint } = authResponse;

    // Create form data for ImageKit upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("publicKey", publicKey);
    formData.append("signature", authenticParameters.signature);
    formData.append("expire", authenticParameters.expire.toString());
    formData.append("token", authenticParameters.token);

    // Upload to ImageKit
    const uploadResponse = await fetch(
      "https://upload.imagekit.io/api/v1/files/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload to ImageKit");
    }

    const result = await uploadResponse.json();
    return result.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title.trim()) return;

    try {
      setUploadProgress({
        stage: "uploading",
        progress: 0,
        message: "Uploading video...",
      });

      // Upload video to ImageKit
      const videoUrl = await uploadToImageKit(selectedFile);

      setUploadProgress({
        stage: "uploading",
        progress: 50,
        message: "Generating thumbnail...",
      });

      // Generate thumbnail URL (ImageKit auto-generates thumbnails)
      const thumbnailUrl = videoUrl.replace(/\.[^/.]+$/, "") + ".jpg";

      setUploadProgress({
        stage: "processing",
        progress: 75,
        message: "Saving video details...",
      });

      // Save video details to database
      await apiClient.post("/api/video", {
        title: title.trim(),
        description: description.trim(),
        videourl: videoUrl,
        thumbnailurl: thumbnailUrl,
        controls: true,
      });

      setUploadProgress({
        stage: "complete",
        progress: 100,
        message: "Video uploaded successfully!",
      });

      // Reset form after success
      setTimeout(() => {
        resetForm();
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadProgress({
        stage: "error",
        progress: 0,
        message: error.message || "Upload failed. Please try again.",
      });
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setTitle("");
    setDescription("");
    setUploadProgress({ stage: "idle", progress: 0, message: "" });
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = () => {
    resetForm();
  };

  const getProgressIcon = () => {
    switch (uploadProgress.stage) {
      case "uploading":
      case "processing":
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case "complete":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Upload New Video
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          {!selectedFile ? (
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                "hover:border-primary/50 cursor-pointer",
                "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
              )}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Upload your video</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your video file here, or click to browse
              </p>
              <Badge variant="outline" className="mb-2">
                MP4, MOV, AVI up to 50MB
              </Badge>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    {previewUrl && (
                      <video
                        src={previewUrl}
                        className="w-32 h-24 object-cover rounded-lg"
                        controls={false}
                        muted
                      />
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                      onClick={removeFile}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    {uploadProgress.stage !== "idle" && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          {getProgressIcon()}
                          <span className="text-sm">
                            {uploadProgress.message}
                          </span>
                        </div>
                        {uploadProgress.progress > 0 && (
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${uploadProgress.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Video Details */}
          {selectedFile && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter video title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {title.length}/100 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Describe your video..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/500 characters
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={
                uploadProgress.stage === "uploading" ||
                uploadProgress.stage === "processing"
              }
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !selectedFile ||
                !title.trim() ||
                uploadProgress.stage === "uploading" ||
                uploadProgress.stage === "processing"
              }
            >
              {uploadProgress.stage === "uploading" ||
              uploadProgress.stage === "processing" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Video"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
