import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Camera, X, RotateCw, Check } from "lucide-react";
import { toast } from "sonner";

interface CameraCaptureProps {
  open: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
  title?: string;
}

export default function CameraCapture({ open, onClose, onCapture, title = "Capture Photo" }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
    }

    return () => {
      stopCamera();
    };
  }, [open, facingMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error: any) {
      console.error("Error accessing camera:", error);

      let errorMessage = "Unable to access camera. ";

      if (error.name === "NotAllowedError") {
        errorMessage += "Camera permission was denied.";
      } else if (error.name === "NotFoundError") {
        errorMessage += "No camera found on this device.";
      } else if (error.name === "NotSupportedError" || error.name === "TypeError") {
        errorMessage += "Camera access requires HTTPS. Please use localhost or enable HTTPS, or use the file upload option instead.";
      } else {
        errorMessage += "Please check camera permissions in browser settings.";
      }

      toast.error(errorMessage, {
        duration: 6000,
      });

      // Close dialog after showing error
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedImage(imageDataUrl);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      stopCamera();
      setCapturedImage(null);
      onClose();
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            {!capturedImage ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="flex justify-center gap-2">
            {!capturedImage ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={switchCamera}
                  title="Switch Camera"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="lg"
                  onClick={capturePhoto}
                  className="gap-2"
                >
                  <Camera className="h-5 w-5" />
                  Capture Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleClose}
                  title="Cancel"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={retakePhoto}
                  className="gap-2"
                >
                  <RotateCw className="h-4 w-4" />
                  Retake
                </Button>
                <Button
                  type="button"
                  onClick={confirmPhoto}
                  className="gap-2"
                >
                  <Check className="h-4 w-4" />
                  Use This Photo
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

