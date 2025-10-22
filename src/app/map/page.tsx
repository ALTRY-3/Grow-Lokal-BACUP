"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const MapContent = dynamic(() => import("./MapContent"), { ssr: false });

export default function MapPage() {
  const router = useRouter();

  return (
    <main className="map-page">
      <button onClick={() => router.push("/events")} className="back-button">
        ←
      </button>

      <div className="map-wrapper">
        <MapContent />
      </div>
    </main>
  );
}

