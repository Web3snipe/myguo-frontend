"use client";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-gray-800 border-t-primary rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-400">Loading...</h2>
      </div>
    </div>
  );
}

