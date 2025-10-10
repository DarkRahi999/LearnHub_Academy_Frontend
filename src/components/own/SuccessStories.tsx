"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

interface Story {
  id: number;
  author: string;
  topic: string;
  excerpt: string;
  image: string;
  timeAgo: string;
}

const stories: Story[] = [
  {
    id: 1,
    author: "Veronika",
    topic: "Career Coaching",
    excerpt:
      "Working with Sarah as my coach has been a journey of self-discovery. When the right questions are asked, I can find the...",
    image: "https://placehold.co/400x300/F5CBA7/ffffff?text=Veronika",
    timeAgo: "2 years ago",
  },
  {
    id: 2,
    author: "Makayla",
    topic: "Life Coaching",
    excerpt:
      "It was the best decision I have ever made! When I chose to work with Lisa, I was struggling to know how to move forward in life. I had walked away from my religion...",
    image: "https://placehold.co/400x300/AED6F1/ffffff?text=Makayla",
    timeAgo: "2 years ago",
  },
  {
    id: 3,
    author: "Belinda",
    topic: "Confidence Building",
    excerpt:
      "Finding the confidence to move forward. Thinking about career coaching? Belinda shares her story after 6 sessions with Helen from Destinations Coaching.",
    image: "https://placehold.co/400x300/E8DAEF/ffffff?text=Belinda",
    timeAgo: "2 years ago",
  },
  {
    id: 4,
    author: "Hele",
    topic: "Personal Growth",
    excerpt:
      "The best version of myself. Since June I've been working closely with Sian as my life/mindset coach. I haven't once looked back. Before...",
    image: "https://placehold.co/400x300/D5F5E3/ffffff?text=Hele",
    timeAgo: "2 years ago",
  },
  {
    id: 5,
    author: "Julie Crowley",
    topic: "Career Transition",
    excerpt:
      "I am more confident and can make things happen. I became a life coach myself following my own coaching journey. It started with a self-help coaching book that introduce...",
    image: "https://placehold.co/400x300/FADBD8/ffffff?text=Julie",
    timeAgo: "4 years ago",
  },
];

const topics = [
  "Any topic",
  "Career Coaching",
  "Life Coaching",
  "Confidence Building",
  "Personal Growth",
  "Career Transition",
];

export default function SuccessStories() {
  const [selectedTopic, setSelectedTopic] = useState("Any topic");

  const filteredStories =
    selectedTopic === "Any topic"
      ? stories
      : stories.filter((story) => story.topic === selectedTopic);

  return (
    <div className="">
      <div className="container mx-auto px-4 py-6 sm:pt-20">

        {/* Filter Dropdown */}
        <div className="relative inline-block text-left mb-6 w-full sm:w-auto">
          <label htmlFor="topic-filter" className="sr-only">
            Filter by topic
          </label>
          <div className="relative">
            <select
              id="topic-filter"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="appearance-none w-full sm:w-56 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-100 py-2 pl-4 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {topics.map((topic) => (
                <option
                  key={topic}
                  value={topic}
                >{`Filter by: ${topic}`}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mapped Story Cards */}
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-slate-800 transition-transform transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative w-full h-48">
                <Image
                  src={story.image}
                  alt={story.author}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  <span className="text-gray-600 dark:text-gray-400 font-normal italic">
                    ‘
                  </span>
                  {story.excerpt.split(". ")[0]}...
                  <span className="text-gray-600 dark:text-gray-400 font-normal italic">
                    ’
                  </span>
                </p>
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
                  <span>{story.author}</span>
                  <span>{story.timeAgo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
