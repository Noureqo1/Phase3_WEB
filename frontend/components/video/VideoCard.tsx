'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Video {
  _id: string;
  title: string;
  description: string;
  duration: number;
  owner: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  videoUrl: string;
  thumbnail?: string;
  likes: number;
  reviews: number;
  createdAt: string;
}

export default function VideoCard({ video }: { video: Video }) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timeAgo = formatDistanceToNow(new Date(video.createdAt), { addSuffix: true });

  return (
    <Link href={`/video/${video._id}`}>
      <div className="group cursor-pointer">
        {/* Thumbnail */}
        <div className="relative bg-gray-300 rounded-lg overflow-hidden mb-3 aspect-video">
          <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm10 12H5V5h10v10zM9 6a1 1 0 011.553-.832l3.001 2a1 1 0 010 1.664l-3 2A1 1 0 019 10V6z" />
            </svg>
          </div>
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition"></div>
        </div>

        {/* Video Info */}
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition">
            {video.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {video.owner.firstName} {video.owner.lastName}
          </p>
          <div className="flex gap-4 text-xs text-gray-500 mt-2">
            <span>{video.likes} likes</span>
            <span>{video.reviews} reviews</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
