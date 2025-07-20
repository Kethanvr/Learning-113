"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Film, FileVideo, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

interface VideoUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface UploadResponse {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  filePath: string;
}

export function VideoUpload({ isOpen, onClose, onSuccess }: VideoUploadProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith("video/")) {
        setSelectedFile(file);
        setFormData((prev) => ({
          ...prev,
          title: file.name.replace(/\.[^/.]+$/, ""),
        }));
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a video file",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith("video/")) {
        setSelectedFile(file);
        setFormData((prev) => ({
          ...prev,
          title: file.name.replace(/\.[^/.]+$/, ""),
        }));
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a video file",
          variant: "destructive",
        });
      }
    }
  };

  const uploadToImageKit = async (file: File): Promise<UploadResponse> => {
    try {
      // Get authentication parameters from the server
      const authResponse = await fetch("/api/upload-auth");
      if (!authResponse.ok) {
        throw new Error("Failed to get upload authentication");
      }

      const authData = await authResponse.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("publicKey", authData.publicKey);
      formData.append("signature", authData.authenticParameters.signature);
      formData.append("expire", authData.authenticParameters.expire.toString());
      formData.append("token", authData.authenticParameters.token);
      formData.append("folder", "/videos");
      formData.append("fileName", `video_${Date.now()}_${file.name}`);

      const response = await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("ImageKit upload error:", errorData);
        throw new Error(
          `Upload failed: ${errorData.message || response.statusText}`
        );
      }

      const result = await response.json();

      return {
        fileId: result.fileId,
        name: result.name,
        url: result.url,
        thumbnailUrl: result.thumbnailUrl || result.url,
        filePath: result.filePath,
      };
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !formData.title.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a video and add a title",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      // Upload to ImageKit
      const uploadResult = await uploadToImageKit(selectedFile);

      // Save video data to database
      const videoData = {
        title: formData.title,
        desciption: formData.description,
        videourl: uploadResult.url,
        thumbnailurl: uploadResult.thumbnailUrl || uploadResult.url,
        userid: session?.user?.email,
        username: session?.user?.name || session?.user?.email,
        likes: 0,
        comments: [],
        views: 0,
        controls: true,
        transformation: {
          width: 400,
          height: 600,
          crop: "maintain_ratio",
        },
      };

      const response = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(videoData),
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your video has been uploaded successfully",
        });

        // Reset form
        setSelectedFile(null);
        setFormData({ title: "", description: "" });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        onSuccess?.();
        onClose();
      } else {
        throw new Error("Failed to save video");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description:
          "There was an error uploading your video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white backdrop-blur-md border border-gray-200 shadow-2xl">
        <DialogHeader className="text-center pb-4 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Film className="w-6 h-6 text-purple-600" />
            Upload Your Video
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Share your amazing content with the world
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* File Upload Area */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-gray-900">
              Video File
            </Label>

            {!selectedFile ? (
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer hover:border-purple-400 hover:bg-purple-50 ${
                  dragActive
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-300"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-900 mb-2">
                      Drop your video here, or click to browse
                    </p>
                    <p className="text-gray-500">
                      Supports MP4, MOV, AVI, and other video formats
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Maximum file size: 100MB
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <FileVideo className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeFile}
                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Video Details */}
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="title"
                className="text-lg font-semibold text-gray-900"
              >
                Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Give your video an amazing title..."
                className="mt-2 bg-gray-50 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                required
              />
            </div>

            <div>
              <Label
                htmlFor="description"
                className="text-lg font-semibold text-gray-900"
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Tell viewers about your video..."
                rows={3}
                className="mt-2 bg-gray-50 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                <span>Uploading video...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedFile || !formData.title.trim() || isUploading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Video
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
