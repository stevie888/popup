"use client";

import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FaQrcode, FaCamera, FaArrowLeft, FaGlobe, FaSignOutAlt, FaUmbrella, FaMapMarkerAlt, FaClock, FaCoins } from "react-icons/fa";
import jsQR from 'jsqr';

export default function ScanPage() {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ne'>('en');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  console.log('📱 ScanPage: Rendering with user:', user ? user.name : 'null');
  console.log('📱 ScanPage: Loading:', loading, 'Authenticated:', isAuthenticated);

  useEffect(() => {
    console.log('📱 ScanPage: useEffect triggered');
    console.log('📱 ScanPage: Loading:', loading, 'Authenticated:', isAuthenticated, 'User:', user ? user.name : 'null');
    
    if (!loading && !isAuthenticated) {
      console.log('📱 ScanPage: Not authenticated, redirecting to login');
      router.push("/en/login");
      return;
    } else if (!loading && isAuthenticated && user) {
      console.log('📱 ScanPage: User authenticated:', user.name);
    }
  }, [loading, isAuthenticated, user, router]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/en/login");
  };

  const handleLanguageChange = (language: 'en' | 'ne') => {
    setCurrentLanguage(language);
  };

  const startScanning = async () => {
    try {
      setCameraError(null);
      setIsScanning(true);
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      console.log('Camera started successfully');
      
      // Start QR code detection
      startQRDetection();
      
    } catch (error) {
      console.error('Camera error:', error);
      setCameraError(
        currentLanguage === 'en' 
          ? 'Camera access denied. Please allow camera permissions and try again.' 
          : 'क्यामेरा पहुँच अस्वीकृत। कृपया क्यामेरा अनुमतिहरू दिनुहोस् र फेरि प्रयास गर्नुहोस्।'
      );
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    setScannedData(null);
    setCameraError(null);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    console.log('Camera stopped');
  };

  const startQRDetection = () => {
    const scanQRCode = () => {
      if (!isScanning || !videoRef.current || !canvasRef.current) {
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get image data for QR detection
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Scan for QR code
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        console.log('QR Code found:', code.data);
        handleScan(code.data);
        return;
      }

      // Continue scanning
      animationFrameRef.current = requestAnimationFrame(scanQRCode);
    };

    // Start scanning
    scanQRCode();
  };

  const handleScan = (data: string) => {
    setScannedData(data);
    setIsScanning(false);
    
    // Stop camera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    console.log('Scanned data:', data);
  };

  const handleRent = () => {
    // In a real app, this would process the rental
    console.log('Processing rental for umbrella:', scannedData);
    alert(currentLanguage === 'en' ? 'Rental successful!' : 'भाडा सफल!');
    router.push("/en/dashboard");
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  // Show loading if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/en/dashboard")}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <FaArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-semibold">
                  {currentLanguage === 'en' ? 'Scan QR Code' : 'QR कोड स्क्यान गर्नुहोस्'}
                </h1>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'en' ? 'Scan to rent an umbrella' : 'छाता भाडा लिन QR कोड स्क्यान गर्नुहोस्'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Language Switcher */}
              <button
                onClick={() => handleLanguageChange(currentLanguage === 'en' ? 'ne' : 'en')}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                title={currentLanguage === 'en' ? 'Switch to Nepali' : 'Switch to English'}
              >
                <FaGlobe size={18} />
                <span className="ml-1 text-xs">
                  {currentLanguage === 'en' ? 'EN' : 'ने'}
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600"
              >
                <FaSignOutAlt size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">
              <FaQrcode className="inline mr-2" />
              {currentLanguage === 'en' ? 'QR Code Scanner' : 'QR कोड स्क्यानर'}
            </h2>
          </div>

          <div className="p-6">
            {!isScanning && !scannedData && (
              <div className="text-center">
                <div className="mb-6">
                  <FaQrcode className="text-gray-400 text-6xl mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {currentLanguage === 'en' ? 'Ready to Scan' : 'स्क्यान गर्न तयार'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {currentLanguage === 'en' 
                      ? 'Point your camera at the QR code on the umbrella to start renting.' 
                      : 'छातामा भएको QR कोडमा आफ्नो क्यामेरा तर्फ गर्नुहोस् र भाडा सुरु गर्नुहोस्।'}
                  </p>
                </div>
                <button
                  onClick={startScanning}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <FaCamera size={20} />
                  <span className="font-medium">
                    {currentLanguage === 'en' ? 'Start Scanning' : 'स्क्यानिङ सुरु गर्नुहोस्'}
                  </span>
                </button>
                
                {/* Demo QR Code for Testing */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    {currentLanguage === 'en' ? 'Demo QR Code (for testing)' : 'डेमो QR कोड (परीक्षणको लागि)'}
                  </h4>
                  <div className="bg-white p-4 rounded border">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto bg-gray-200 border-2 border-dashed border-gray-400 rounded flex items-center justify-center">
                        <div className="text-center">
                          <FaQrcode className="text-gray-400 text-2xl mx-auto mb-1" />
                          <p className="text-xs text-gray-500">UMB-123456</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        {currentLanguage === 'en' ? 'Scan this demo code to test the rental process' : 'भाडा प्रक्रिया परीक्षण गर्न यो डेमो कोड स्क्यान गर्नुहोस्'}
                      </p>
                      <button
                        onClick={() => handleScan('UMB-123456')}
                        className="mt-2 px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                      >
                        {currentLanguage === 'en' ? 'Test Demo Code' : 'डेमो कोड परीक्षण गर्नुहोस्'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isScanning && (
              <div className="text-center">
                <div className="mb-6">
                  <div className="relative w-80 h-80 mx-auto border-2 border-blue-500 rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                      muted
                    />
                    <canvas
                      ref={canvasRef}
                      className="hidden"
                    />
                    <div className="absolute inset-0 border-4 border-blue-500 border-dashed pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-32 h-32 border-2 border-blue-500 bg-transparent"></div>
                      </div>
                    </div>
                    {cameraError && (
                      <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                        <div className="text-center text-white p-4">
                          <FaCamera className="text-4xl mx-auto mb-2" />
                          <p className="text-sm">{cameraError}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mt-4">
                    {currentLanguage === 'en' 
                      ? 'Position the QR code within the frame' 
                      : 'QR कोडलाई फ्रेम भित्र राख्नुहोस्'}
                  </p>
                  {!cameraError && (
                    <p className="text-blue-600 text-sm mt-2">
                      {currentLanguage === 'en' ? 'Scanning...' : 'स्क्यान गर्दै...'}
                    </p>
                  )}
                </div>
                <button
                  onClick={stopScanning}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  {currentLanguage === 'en' ? 'Stop Scanning' : 'स्क्यानिङ रोक्नुहोस्'}
                </button>
              </div>
            )}

            {scannedData && (
              <div className="text-center">
                <div className="mb-6">
                  <FaUmbrella className="text-green-500 text-6xl mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {currentLanguage === 'en' ? 'Umbrella Found!' : 'छाता फेला पर्यो!'}
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                      <div className="flex items-center space-x-2">
                        <FaUmbrella className="text-blue-500" size={16} />
                        <span className="text-sm text-gray-600">
                          {currentLanguage === 'en' ? 'Umbrella ID:' : 'छाता ID:'}
                        </span>
                        <span className="font-medium">{scannedData}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaMapMarkerAlt className="text-green-500" size={16} />
                        <span className="text-sm text-gray-600">
                          {currentLanguage === 'en' ? 'Location:' : 'स्थान:'}
                        </span>
                        <span className="font-medium">Station A</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaClock className="text-yellow-500" size={16} />
                        <span className="text-sm text-gray-600">
                          {currentLanguage === 'en' ? 'Rate:' : 'दर:'}
                        </span>
                        <span className="font-medium">5 credits/hour</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaCoins className="text-yellow-500" size={16} />
                        <span className="text-sm text-gray-600">
                          {currentLanguage === 'en' ? 'Your Credits:' : 'तपाईंको क्रेडिट:'}
                        </span>
                        <span className="font-medium">{user.credits || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4 justify-center">
                  <button
                    onClick={handleRent}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <FaUmbrella size={20} />
                    <span className="font-medium">
                      {currentLanguage === 'en' ? 'Rent Now' : 'अहिले भाडा लिनुहोस्'}
                    </span>
                  </button>
                  <button
                    onClick={() => setScannedData(null)}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    {currentLanguage === 'en' ? 'Scan Again' : 'फेरि स्क्यान गर्नुहोस्'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 