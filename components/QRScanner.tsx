"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { FaQrcode, FaCamera, FaTimes, FaCheck } from 'react-icons/fa';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function QRScanner({ onScan, onClose, isOpen }: QRScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [scannedData, setScannedData] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen && !scanning) {
      startScanning();
    }
    return () => {
      stopScanning();
    };
  }, [isOpen]);

  const startScanning = async () => {
    try {
      setError('');
      setScanning(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera access to scan QR codes.');
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const handleScan = (data: string) => {
    setScannedData(data);
    onScan(data);
    stopScanning();
  };

  const validateQRCode = (data: string) => {
    // Validate if QR code is for umbrella rental
    try {
      const parsed = JSON.parse(data);
      return parsed.type === 'umbrella_rental' && parsed.stationId;
    } catch {
      return false;
    }
  };

  const handleManualInput = () => {
    const manualCode = prompt('Enter QR code data manually:');
    if (manualCode && validateQRCode(manualCode)) {
      handleScan(manualCode);
    } else {
      setError('Invalid QR code format');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Scan QR Code</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
          <video
            ref={videoRef}
            className="w-full h-64 object-cover"
            autoPlay
            playsInline
            muted
          />
          {scanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-2 border-yellow-400 w-48 h-48 rounded-lg relative">
                <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-400"></div>
                <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-yellow-400"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-yellow-400"></div>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="flex gap-2">
          <Button
            onClick={handleManualInput}
            className="flex-1 bg-gray-500 hover:bg-gray-600"
          >
            <FaQrcode className="mr-2" />
            Manual Input
          </Button>
          <Button
            onClick={scanning ? stopScanning : startScanning}
            className="flex-1 bg-[#FFD600] hover:bg-yellow-400 text-black"
          >
            <FaCamera className="mr-2" />
            {scanning ? 'Stop' : 'Start'} Scanning
          </Button>
        </div>

        <div className="mt-4 text-sm text-gray-600 text-center">
          Point your camera at the QR code on the umbrella station
        </div>
      </div>
    </div>
  );
} 