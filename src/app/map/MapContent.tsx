"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCheck,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";
import { faMap } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export default function MapContent() {
  const events = [
    {
      title: "Artisan Fair",
      image: "/event1.jpg",
      date: "2025-09-15",
      location: "SM City Olongapo",
      lat: 14.8333,
      lng: 120.2828,
      details: "A four-day artisan fair featuring Filipino crafts.",
    },
    {
      title: "Alab Sining 2026",
      image: "/event2.jpg",
      date: "2026-02-27",
      location: "SM City Olongapo Central",
      lat: 14.8355,
      lng: 120.2839,
      details: "An art exhibit showcasing works from local artists.",
    },
    {
      title: "This Is Not Art Escape",
      image: "/event3.png",
      date: "2025-10-25",
      location: "Ayala Malls Harbor Point",
      lat: 14.8276,
      lng: 120.2823,
      details: "A two-day art market with handmade crafts and artworks.",
    },
    {
      title: "Crft PINAY Pottery Experience",
      image: "/event4.png",
      date: "2026-06-22",
      location: "Sibul Kapihan, SBFZ",
      lat: 14.815,
      lng: 120.315,
      details: "A pottery workshop with hands-on traditional techniques.",
    },
    {
      title: "My City, My SM, My Crafts",
      image: "/event5.png",
      date: "2025-09-16",
      location: "SM City Olongapo",
      lat: 14.8333,
      lng: 120.2828,
      details: "A showcase of local Filipino artisans and craftsmanship.",
    },
  ];

  const [reminders, setReminders] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [radius, setRadius] = useState(0); // km
  const [filtersOpen, setFiltersOpen] = useState(false);

  const center: [number, number] = [14.8333, 120.2828];

  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesDate = dateFilter ? event.date === dateFilter : true;
    const matchesRadius =
      radius > 0
        ? getDistance(center[0], center[1], event.lat, event.lng) <= radius
        : true;
    return matchesSearch && matchesDate && matchesRadius;
  });

  const customIcon = L.divIcon({
    className: "custom-pin",
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 24 36">
        <path d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 24 12 24s12-15.6 12-24C24 5.4 18.6 0 12 0z" 
          fill="#2E3F36"/>
        <circle cx="12" cy="12" r="5" fill="white"/>
      </svg>
    `,
    iconSize: [32, 48],
    iconAnchor: [16, 48],
    popupAnchor: [0, -42],
  });

  const handleSetReminder = (idx: number, eventTitle: string) => {
    if (!reminders.includes(idx)) {
      setReminders([...reminders, idx]);
      toast.success(`Reminder set for "${eventTitle}"!`);
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      <div className="search-box">
        <div
          className="discover-header"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <div className="discover-title">
            <FontAwesomeIcon icon={faMap} className="map-icon" />
            <span>Discover</span>
          </div>
          <FontAwesomeIcon
            icon={filtersOpen ? faChevronUp : faChevronDown}
            className="arrow-icon"
          />
        </div>

        {filtersOpen && (
          <div className="map-search-bar">
            <input
              type="text"
              placeholder="Search event title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            >
              <option value={0}>Any distance</option>
              <option value={2}>Within 2 km</option>
              <option value={5}>Within 5 km</option>
              <option value={10}>Within 10 km</option>
            </select>
          </div>
        )}
      </div>

      <MapContainer
        // @ts-ignore - react-leaflet v5 type definitions
        center={center}
        zoom={14}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredEvents.map((event, idx) => (
          // @ts-ignore - react-leaflet v5 type definitions
          <Marker key={idx} position={[event.lat, event.lng]} icon={customIcon}>
            <Popup>
              <div className="popup-card">
                <div style={{ position: "relative", width: "100%" }}>
                  <button
                    className="popup-bell-btn"
                    title={
                      reminders.includes(idx) ? "Reminder set" : "Set reminder"
                    }
                    onClick={() => handleSetReminder(idx, event.title)}
                    disabled={reminders.includes(idx)}
                  >
                    <FontAwesomeIcon
                      icon={reminders.includes(idx) ? faCheck : faBell}
                    />
                  </button>
                  <img
                    src={event.image}
                    alt={event.title}
                    className="popup-img"
                  />
                </div>
                <div className="popup-info">
                  <h3>{event.title}</h3>
                  <p className="date">📅 {event.date}</p>
                  <p className="location">📍 {event.location}</p>
                  <p className="details">{event.details}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}

