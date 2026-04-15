'use client';

import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { useAuth } from '@/app/providers/AuthProvider';
import ReviewForm from '@/components/video/ReviewForm';
import ReviewList from '@/components/video/ReviewList';

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
  likes: number;
  likedBy?: string[];
  createdAt: string;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

export default function VideoPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`${API_URL}/videos/${params.id}`);
        setVideo(response.data.data);
        setIsLiked(response.data.data.likedBy?.includes(user?.id) || false);
      } catch (err) {
        setError('Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [params.id, user?.id, API_URL]);

  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like videos');
      return;
    }

    try {
      if (isLiked) {
        await axios.delete(`${API_URL}/videos/${params.id}/like`);
        setIsLiked(false);
        if (video) {
          setVideo({ ...video, likes: video.likes - 1 });
        }
      } else {
        await axios.post(`${API_URL}/videos/${params.id}/like`);
        setIsLiked(true);
        if (video) {
          setVideo({ ...video, likes: video.likes + 1 });
        }
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleReviewSubmit = (newReview: Review) => {
    setReviews([newReview, ...reviews]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Video not found'}</p>
          <a href="/discover" className="text-purple-600 hover:underline">
            Back to Discover
          </a>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === video.owner._id;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Video Player */}
        <div className="bg-black rounded-lg overflow-hidden mb-6 aspect-video">
          <ReactPlayer
            url={video.videoUrl}
            controls
            width="100%"
            height="100%"
            playing={false}
          />
        </div>

        {/* Video Info */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{video.title}</h1>
              <p className="text-gray-600 mb-4">{video.description}</p>
              <p className="text-sm text-gray-500">
                By {video.owner.firstName} {video.owner.lastName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 mb-2">{video.likes}</p>
              <p className="text-gray-500 mb-4">Likes</p>
              <button
                onClick={handleLike}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  isLiked
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                {isLiked ? '❤️ Liked' : '🤍 Like'}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          {isOwner && (
            <div className="flex gap-4 mt-4">
              <button className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300">
                ✏️ Edit
              </button>
              <button className="px-4 py-2 bg-red-200 text-red-900 rounded-lg hover:bg-red-300">
                🗑️ Delete
              </button>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Reviews ({reviews.length})
          </h2>

          {user && <ReviewForm videoId={params.id} onSubmit={handleReviewSubmit} />}

          <ReviewList
            reviews={reviews}
            currentUserId={user?.id}
            isOwner={isOwner}
          />
        </div>
      </div>
    </div>
  );
}
