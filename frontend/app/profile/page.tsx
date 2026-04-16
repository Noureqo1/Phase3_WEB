'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import VideoCard from '@/components/video/VideoCard';
import { useRouter } from 'next/navigation';

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

interface User {
  _id: string;
  username: string;
  email: string;
  avatarKey?: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'videos' | 'liked' | 'settings'>('videos');
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // Fetch user profile
      const userResponse = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch user's videos
      const videosResponse = await axios.get(`${API_URL}/videos/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(userResponse.data.data);
      setVideos(videosResponse.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      const token = Cookies.get('token');
      await axios.delete(`${API_URL}/videos/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove video from state
      setVideos(videos.filter(video => video._id !== videoId));
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to delete video');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'User not found'}</p>
          <button 
            onClick={() => router.push('/discover')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Discover
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{videos.length}</div>
                <div className="text-sm text-gray-500">Videos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {videos.reduce((sum, video) => sum + video.likes, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Likes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('videos')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'videos'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Videos
              </button>
              <button
                onClick={() => setActiveTab('liked')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'liked'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Liked Videos
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Settings
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'videos' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Videos</h2>
              <button
                onClick={() => router.push('/upload')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Upload New Video
              </button>
            </div>

            {videos.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">📹</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No videos yet</h3>
                <p className="text-gray-600 mb-6">Upload your first video to get started!</p>
                <button
                  onClick={() => router.push('/upload')}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Upload Video
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <div key={video._id} className="relative group">
                    <VideoCard video={video} />
                    <button
                      onClick={() => handleDeleteVideo(video._id)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'liked' && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Liked Videos</h3>
            <p className="text-gray-600">This feature is coming soon!</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={user.username}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div className="pt-4">
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
