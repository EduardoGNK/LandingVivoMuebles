import React, { createContext, useContext, useState } from "react";

interface AIImageContextType {
  iaImage: string | null;
  setIaImage: (img: string | null) => void;
}

const AIImageContext = createContext<AIImageContextType | undefined>(undefined);

export function useAIImage() {
  const ctx = useContext(AIImageContext);
  if (!ctx) throw new Error("useAIImage must be used within AIImageProvider");
  return ctx;
}

export function AIImageProvider({ children }: { children: React.ReactNode }) {
  const [iaImage, setIaImage] = useState<string | null>(null);
  return (
    <AIImageContext.Provider value={{ iaImage, setIaImage }}>
      {children}
    </AIImageContext.Provider>
  );
}
