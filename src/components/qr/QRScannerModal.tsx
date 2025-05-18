
import React, { useRef, useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, ScanLine } from "lucide-react";

interface QRScannerModalProps {
  open: boolean;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ open, onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const [scanActive, setScanActive] = useState(true);
  const navigate = useNavigate();
  const scannerRef = useRef<HTMLDivElement>(null);
  
  // Reset error when modal opens
  useEffect(() => {
    if (open) {
      setError(null);
      setScanActive(true);
    }
  }, [open]);

  const handleScanSuccess = (result: string) => {
    setScanActive(false);
    console.log("QR Code scanned:", result);
    
    // Check if URL is an event check-in URL
    try {
      const url = new URL(result);
      if (url.pathname.includes('/event-check-in/')) {
        // Navigate to the check-in page
        navigate(url.pathname);
        onClose();
      } else {
        setError("Invalid QR code: Not an event check-in QR code");
      }
    } catch (e) {
      setError("Invalid QR code format");
    }
  };

  const handleError = (error: Error) => {
    console.error("QR Scanner error:", error);
    setError("Failed to initialize camera. Please make sure you've granted camera permissions.");
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <ScanLine className="h-5 w-5 text-primary" />
            Scan Event QR Code
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          {/* Scanner */}
          <div 
            ref={scannerRef}
            className="w-full aspect-square bg-black"
          >
            {scanActive && (
              <Scanner
                onScan={handleScanSuccess}
                onError={handleError}
                containerStyle={{
                  width: '100%',
                  height: '100%'
                }}
              />
            )}
            
            {/* Scanner crosshair overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-1/2 h-1/2 border-2 border-white/50 rounded-lg"></div>
            </div>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white p-6">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-center mb-6">{error}</p>
              <Button variant="outline" onClick={() => setError(null)} className="bg-white/10 text-white border-white/20">
                Try Again
              </Button>
            </div>
          )}
        </div>
        
        <div className="p-4 flex justify-between">
          <Button variant="ghost" onClick={onClose} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Close
          </Button>
          <p className="text-xs text-muted-foreground self-center">
            Scan an event QR code to check in
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
