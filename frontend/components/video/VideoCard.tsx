'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Video {
  _id: string;
  title: string;
  description: string;
  duration: number;
  owner: {
    _id: string;
    username: string;
  };
  videoUrl: string;
  thumbnail?: string;
  likes: number;
  reviews: number;
  views?: number;
  createdAt: string;
}

export default function VideoCard({ video }: { video: Video }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

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
        <div className="relative rounded-xl overflow-hidden mb-3 aspect-video bg-gray-100">
          {video.thumbnail && !imageError ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white border-opacity-30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  setImageError(true);
                }}
              />
            </>
          ) : null}
          {/* Modern fallback placeholder */}
          <div className={`w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center ${(!video.thumbnail || imageError) ? '' : 'hidden'}`}>
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-10 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 mx-auto border border-white border-opacity-20">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm10 12H5V5h10v10zM9 6a1 1 0 011.553-.832l3.001 2a1 1 0 010 1.664l-3 2A1 1 0 019 10V6z" />
                </svg>
              </div>
              <p className="text-xs text-gray-300 font-medium">No Thumbnail</p>
              <p className="text-xs text-gray-500 mt-1">Video processing...</p>
            </div>
          </div>
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
            {formatDuration(video.duration)}
          </div>
          {/* Play button overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300 shadow-lg">
              <svg className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm10 12H5V5h10v10zM9 6a1 1 0 011.553-.832l3.001 2a1 1 0 010 1.664l-3 2A1 1 0 019 10V6z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors text-sm leading-tight">
            {video.title}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 font-medium">
              {video.owner.username}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <span>{video.views || 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>{video.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{video.reviews} reviews</span>
            </div>
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
