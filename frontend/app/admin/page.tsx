'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/app/providers/AuthProvider';
import Cookies from 'js-cookie';

interface Stats {
  totalUsers: number;
  totalVideos: number;
  totalReviews: number;
  totalFollows: number;
}

interface HealthInfo {
  status: string;
  timestamp: string;
  service: string;
}

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [health, setHealth] = useState<HealthInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAdminData = async () => {
      try {
        const token = Cookies.get('token');

        // Fetch stats
        const statsResponse = await axios.get(`${API_URL}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(statsResponse.data.data);

        // Fetch health
        const healthResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/health`
        );
        setHealth(healthResponse.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [isAuthenticated, API_URL]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">You do not have permission to access this page</p>
          <a href="/" className="text-purple-600 hover:underline">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <a href="/" className="text-purple-600 hover:underline">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">System statistics and health monitoring</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Total Users',
              value: stats?.totalUsers || 0,
              icon: '👥',
              color: 'bg-blue-50 text-blue-600',
            },
            {
              label: 'Total Videos',
              value: stats?.totalVideos || 0,
              icon: '🎥',
              color: 'bg-purple-50 text-purple-600',
            },
            {
              label: 'Total Reviews',
              value: stats?.totalReviews || 0,
              icon: '⭐',
              color: 'bg-yellow-50 text-yellow-600',
            },
            {
              label: 'Total Follows',
              value: stats?.totalFollows || 0,
              icon: '🔗',
              color: 'bg-green-50 text-green-600',
            },
          ].map((stat, index) => (
            <div key={index} className={`${stat.color} rounded-lg p-6`}>
              <div className="text-4xl mb-2">{stat.icon}</div>
              <p className="text-sm font-medium opacity-75">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* System Health */}
        {health && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">System Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 mb-2">Status</p>
                <p className="text-2xl font-semibold text-green-600">✓ {health.status}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-2">Service</p>
                <p className="text-lg font-semibold text-gray-900">{health.service}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-600 mb-2">Last Updated</p>
                <p className="text-sm text-gray-500">
                  {new Date(health.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
