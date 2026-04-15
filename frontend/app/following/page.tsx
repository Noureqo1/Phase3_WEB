'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import VideoCard from '@/components/video/VideoCard';

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

export default function FollowingPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  const fetchVideos = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const token = Cookies.get('token');
      const skip = (pageNum - 1) * 12;
      
      const response = await axios.get(
        `${API_URL}/videos/feed/following`,
        {
          params: { skip, limit: 12 },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newVideos = response.data.data || [];
      if (newVideos.length === 0) {
        setHasMore(false);
      } else {
        setVideos((prev) => (pageNum === 1 ? newVideos : [...prev, ...newVideos]));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchVideos(1);
  }, [fetchVideos]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading]);

  useEffect(() => {
    if (page > 1) {
      fetchVideos(page);
    }
  }, [page, fetchVideos]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Following</h1>
          <p className="text-gray-600">Videos from creators you follow</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center mb-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* Infinite scroll trigger */}
        {hasMore && <div ref={observerTarget} className="h-10" />}

        {/* No more videos message */}
        {!hasMore && videos.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            No more videos to load
          </div>
        )}

        {/* Empty state */}
        {videos.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No videos yet. Follow some creators to see their videos here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
