"use client";

import Link from "next/link";
import ImageCarousel from "@/components/ImageCarousel1";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./stories.css";

interface Story {
  id: string;
  img: string;
  title: string;
  artist: string;
  excerpt: string;
}

const stories: Story[] = [
  {
    id: "1",
    img: "/artist1.png",
    title: "Artist 1 Story",
    artist: "Aba Dela Cruz",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: "2",
    img: "/artist2.png",
    title: "Artist 2 Story",
    artist: "Ben Yap",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: "3",
    img: "/artist3.png",
    title: "Artist 3 Story",
    artist: "Carla Abdul",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: "4",
    img: "/artist1.png",
    title: "Artist 4 Story",
    artist: "David Delo Santos",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: "5",
    img: "/artist2.png",
    title: "Artist 5 Story",
    artist: "Ebon Santos",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: "6",
    img: "/artist3.png",
    title: "Artist 6 Story",
    artist: "Frances Toyang",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
];

export default function StoriesPage() {
  return (
    <>
      <Navbar />

      <div className="stories-page">
        <div className="stories-carousel">
          <ImageCarousel autoSlide={true} slideInterval={3000} />
          <div className="stories-carousel-text">
            <h1 className="stories-carousel-title">Stories of Olongapo</h1>
            <p className="stories-carousel-subtext">
              Discover the people, culture, and heritage behind every craft.
            </p>
          </div>
        </div>

        <div className="stories-grid">
          {stories.map((story) => (
            <div key={story.id} className="story-card">
              <img src={story.img} alt={story.title} className="story-img" />

              <h2 className="story-title">{story.title}</h2>
              <p className="story-artist">{story.artist}</p>
              <p className="story-excerpt">{story.excerpt}</p>

              <Link href={`/artiststory/${story.id}`} className="read-more-btn">
                Read More
              </Link>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
