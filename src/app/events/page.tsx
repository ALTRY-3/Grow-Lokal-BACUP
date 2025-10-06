"use client";

import React, { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MdNotifications, MdNotificationsActive } from "react-icons/md";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaSearch } from "react-icons/fa";
import "./events.css";

export default function EventsPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [reminders, setReminders] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof events>([]);
  const [calendarReminder, setCalendarReminder] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);

  const events = [
    {
      date: "2025-09-15",
      title: "Artisan Fair",
      image: "/event1.jpg",
      dateText: "Fri, Sept. 15th 2025",
      location: "SM City Olongapo",
      details:
        "A four-day artisan fair held at SM City Olongapo, featuring a diverse range of Filipino crafts and handmade products from local artisans.",
    },
    {
      date: "2026-02-17",
      title: "Alab Sining 2026",
      image: "/event2.jpg",
      dateText: "Fri, Feb. 27th 2026",
      location: "SM City Olongapo Central",
      details:
        "An art exhibit held at SM City Olongapo Central, showcasing traditional and contemporary artworks by artists from Olongapo, Zambales, and Bataan.",
    },
    {
      date: "2025-10-25",
      title: "This Is Not Art Escape",
      image: "/event3.png",
      dateText: "Sat, Oct. 25th 2025",
      location: "Ayala Malls Harbor Point",
      details:
        "A two-day art market at Ayala Malls Harbor Point, offering handmade crafts, original artworks, and unique creations from local artists.",
    },
    {
      date: "2026-06-22",
      title: "Crft PINAY Pottery Experience",
      image: "/event4.png",
      dateText: "Sat, June 22nd 2026",
      location: "Sibul Kapihan, SBFZ",
      details:
        "A pottery workshop held at Ianthe, providing participants with hands-on experience in traditional Filipino pottery-making techniques.",
    },
    {
      date: "2025-09-16",
      title: "My City, My SM, My Crafts",
      image: "/event5.png",
      dateText: "Sat, Sept. 16th 2025",
      location: "SM City Olongapo",
      details:
        "An initiative by SM City Olongapo to showcase and celebrate the craftsmanship and artistry of local Filipino artisans.",
    },
    {
      date: "2025-10-12",
      title: "Luzon Art Fair 2025",
      image: "/event6.png",
      dateText: "Sun, Oct. 12th 2025",
      location: "Diwa ng Tarlac and Bulwagang Kanlahi, Tarlac City",
      details:
        "Olongapo Zambales Artists (OZA) is a creative collective founded in 2022, born from a shared passion to uplift and unify the art community across Olongapo and the province of Zambales.",
    },
    {
      date: "2025-11-11",
      title: "Sip and Sketch 'Gapo",
      image: "/event7.png",
      dateText: "Tue, Nov. 11th 2025",
      location: "Olongapo City, Sibul Kapihan",
      details:
        "A creative gathering where artists and art enthusiasts come together to sketch, sip beverages, and engage in artistic conversations, fostering a community of local artists.",
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setSuggestions([]);
    } else {
      const filtered = events.filter(
        (event) =>
          event.title.toLowerCase().includes(value.toLowerCase()) ||
          event.location.toLowerCase().includes(value.toLowerCase()) ||
          event.dateText.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    }
  };

  const handleSuggestionClick = (index: number) => {
    setQuery("");
    setSuggestions([]);
    eventRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const toggleReminder = (idx: number) => {
    const eventDate = events[idx].date;
    setReminders((prev) =>
      prev.includes(eventDate)
        ? prev.filter((d) => d !== eventDate)
        : [...prev, eventDate]
    );
  };

  const handleDateClick = (clickedDate: Date) => {
    setDate(clickedDate);
    setCalendarReminder(false);
    const foundEvent = events.find(
      (event) =>
        new Date(event.date).toDateString() === clickedDate.toDateString()
    );
    setSelectedEvent(foundEvent || null);
  };

  return (
    <div className="events-page">
      <Navbar />

      <main role="main">
        <div className="events-search-bar-container">
          <form
            className="events-search-bar"
            role="search"
            aria-label="Search for Olongapo's events"
            onSubmit={(e) => e.preventDefault()}
          >
            <FaSearch className="search-icon" aria-hidden="true" />
            <label htmlFor="events-search" className="sr-only">
              Search for an event or location
            </label>
            <input
              id="events-search"
              className="events-search-input"
              type="text"
              placeholder="Search for an event or location"
              value={query}
              onChange={handleSearchChange}
              aria-label="Search events or locations"
            />
          </form>

          {suggestions.length > 0 && (
            <ul
              className="events-suggestions-box"
              role="listbox"
              aria-label="Event suggestions"
              aria-live="polite"
            >
              {suggestions.map((event, idx) => {
                const eventIndex = events.findIndex(
                  (e) => e.title === event.title
                );
                return (
                  <li
                    key={idx}
                    role="option"
                    tabIndex={0}
                    onClick={() => handleSuggestionClick(eventIndex)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleSuggestionClick(eventIndex);
                      }
                    }}
                  >
                    <img src={event.image} alt={event.title + " event"} />
                    <span>{event.title}</span>
                    <span className="events-suggestion-location">
                      {event.location}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="events-content">
          <div className="events-left">
            {events.map((event, idx) => (
              <article
                className="event-card"
                key={idx}
                ref={(el: HTMLDivElement | null) => {
                  eventRefs.current[idx] = el;
                }}
                aria-labelledby={`event-title-${idx}`}
              >
                <img
                  src={event.image}
                  alt={event.title + " event"}
                  className="event-image"
                />
                <div className="event-info">
                  <div className="event-date">{event.dateText}</div>
                  <div className="event-title" id={`event-title-${idx}`}>
                    {event.title}
                  </div>
                  <div className="event-location">
                    <svg
                      className="location-icon"
                      width="9.92"
                      height="13.33"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
                        fill="#AF7928"
                      />
                    </svg>
                    <span className="location-text">{event.location}</span>
                  </div>
                  <div className="event-details">{event.details}</div>
                </div>

                <div className="event-actions">
                  <button
                    type="button"
                    className={`action-box ${
                      reminders.includes(event.date) ? "active" : ""
                    }`}
                    aria-pressed={reminders.includes(event.date)}
                    aria-label={
                      reminders.includes(event.date)
                        ? "Remove reminder for this event"
                        : "Set a reminder for this event"
                    }
                    onClick={() => toggleReminder(idx)}
                  >
                    {reminders.includes(event.date) ? (
                      <>
                        <MdNotificationsActive
                          className="icon-ringing"
                          aria-hidden="true"
                        />
                        <span>Reminder Set</span>
                      </>
                    ) : (
                      <>
                        <MdNotifications aria-hidden="true" />
                        <span>Set a Reminder</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="calendar-box" aria-label="Event calendar">
            <div className="calendar-header">
              <span className="calendar-title">Calendar</span>
              <div className="calendar-actions">
                <button
                  type="button"
                  className={`calendar-icon-box ${
                    reminders.includes(
                      date.getFullYear() +
                        "-" +
                        String(date.getMonth() + 1).padStart(2, "0") +
                        "-" +
                        String(date.getDate()).padStart(2, "0")
                    )
                      ? "active"
                      : ""
                  }`}
                  aria-pressed={reminders.includes(
                    date.getFullYear() +
                      "-" +
                      String(date.getMonth() + 1).padStart(2, "0") +
                      "-" +
                      String(date.getDate()).padStart(2, "0")
                  )}
                  aria-label={
                    reminders.includes(
                      date.getFullYear() +
                        "-" +
                        String(date.getMonth() + 1).padStart(2, "0") +
                        "-" +
                        String(date.getDate()).padStart(2, "0")
                    )
                      ? "Remove reminder for this date"
                      : "Set a reminder for this date"
                  }
                  onClick={() => {
                    const selectedDateStr =
                      date.getFullYear() +
                      "-" +
                      String(date.getMonth() + 1).padStart(2, "0") +
                      "-" +
                      String(date.getDate()).padStart(2, "0");
                    const hasEvent = events.some(
                      (event) =>
                        new Date(event.date).toDateString() ===
                        date.toDateString()
                    );
                    if (!hasEvent) return;

                    setReminders((reminders) =>
                      reminders.includes(selectedDateStr)
                        ? reminders.filter((d) => d !== selectedDateStr)
                        : [...reminders, selectedDateStr]
                    );
                    setCalendarReminder((prev) => !prev);
                  }}
                >
                  {reminders.includes(
                    date.getFullYear() +
                      "-" +
                      String(date.getMonth() + 1).padStart(2, "0") +
                      "-" +
                      String(date.getDate()).padStart(2, "0")
                  ) ? (
                    <MdNotificationsActive
                      className="icon-ringing"
                      aria-hidden="true"
                    />
                  ) : (
                    <MdNotifications aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div className="calendar-body">
              <Calendar
                value={date}
                onChange={(value) =>
                  value instanceof Date && handleDateClick(value)
                }
                locale="en-US"
                tileClassName={({ date: tileDate }) => {
                  const dateStr =
                    tileDate.getFullYear() +
                    "-" +
                    String(tileDate.getMonth() + 1).padStart(2, "0") +
                    "-" +
                    String(tileDate.getDate()).padStart(2, "0");

                  if (reminders.includes(dateStr)) {
                    return "react-calendar__tile--reminder";
                  }

                  if (
                    calendarReminder &&
                    tileDate.toDateString() === date.toDateString() &&
                    events.some(
                      (event) =>
                        new Date(event.date).toDateString() ===
                        tileDate.toDateString()
                    )
                  ) {
                    return "react-calendar__tile--reminder";
                  }
                  return "";
                }}
                tileContent={({ date: tileDate }) => {
                  const hasEvent = events.some(
                    (event) =>
                      new Date(event.date).toDateString() ===
                      tileDate.toDateString()
                  );
                  return hasEvent ? (
                    <div
                      style={{
                        marginTop: "2px",
                        width: "4px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "#AF7928",
                        marginInline: "auto",
                      }}
                    />
                  ) : null;
                }}
              />
            </div>

            {selectedEvent && (
              <section className="calendar-event-details" aria-live="polite">
                <div className="calendar-event-title">
                  {selectedEvent.title}
                </div>
                <div className="calendar-event-divider"></div>
                <div className="calendar-event-location">
                  <svg
                    className="location-icon"
                    width="12"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                  </svg>
                  <span>{selectedEvent.location}</span>
                </div>
                <div className="calendar-event-description">
                  {selectedEvent.details}
                </div>
              </section>
            )}
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

