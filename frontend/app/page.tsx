'use client';

import Link from 'next/link';
import { useAuth } from '@/app/providers/AuthProvider';

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Share Your Moments
            </h1>
            <p className="text-xl mb-8 text-purple-100">
              Create, discover, and connect with amazing video creators around the world
            </p>
            <div className="flex gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/discover"
                    className="px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition"
                  >
                    Discover Videos
                  </Link>
                  <Link
                    href="/upload"
                    className="px-8 py-3 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-800 transition"
                  >
                    Upload Video
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-8 py-3 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-800 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Hero Animation */}
          <div className="flex justify-center">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-32"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Why Choose ClipSphere?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Easy Upload',
                description: 'Upload your videos with our simple and intuitive platform',
                icon: '📤',
              },
              {
                title: 'Secure Storage',
                description: 'Your videos are safely stored with enterprise-grade security',
                icon: '🔒',
              },
              {
                title: 'Community',
                description: 'Connect with creators and viewers from around the world',
                icon: '👥',
              },
            ].map((feature, i) => (
              <div key={i} className="p-6 border rounded-lg hover:shadow-lg transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
