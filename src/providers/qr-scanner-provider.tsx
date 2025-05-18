
import React, { createContext, useContext, useState } from "react";
import { QRScannerModal } from "@/components/qr/QRScannerModal";

type QRScannerContextType = {
  openScanner: () => void;
  closeScanner: () => void;
};

const QRScannerContext = createContext<QRScannerContextType | undefined>(undefined);

export const QRScannerProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openScanner = () => setIsOpen(true);
  const closeScanner = () => setIsOpen(false);

  return (
    <QRScannerContext.Provider value={{ openScanner, closeScanner }}>
      {children}
      <QRScannerModal open={isOpen} onClose={closeScanner} />
    </QRScannerContext.Provider>
  );
};

export const useQRScanner = () => {
  const context = useContext(QRScannerContext);
  if (context === undefined) {
    throw new Error("useQRScanner must be used within a QRScannerProvider");
  }
  return context;
};
