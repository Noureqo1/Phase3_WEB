'use client';

import React from 'react';

export function VideoCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Thumbnail skeleton */}
      <div className="relative w-full h-48 bg-gray-300">
        {/* Duration badge skeleton */}
        <div className="absolute bottom-2 right-2 w-12 h-6 bg-gray-400 rounded"></div>
        {/* Play button overlay skeleton */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-gray-400 rounded-full"></div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="p-4">
        {/* Title skeleton */}
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
        
        {/* Author info skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Avatar skeleton */}
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            {/* Username skeleton */}
            <div className="h-3 bg-gray-300 rounded w-20"></div>
          </div>
          {/* Stats skeleton */}
          <div className="flex space-x-3">
            <div className="h-3 bg-gray-300 rounded w-12"></div>
            <div className="h-3 bg-gray-300 rounded w-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VideoFeedSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <VideoCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-4">
          {/* Avatar skeleton */}
          <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
          {/* User info skeleton */}
          <div className="flex-1">
            <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-48 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
      </div>
      
      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
          <div className="h-8 bg-gray-300 rounded w-12"></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
          <div className="h-8 bg-gray-300 rounded w-12"></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
          <div className="h-8 bg-gray-300 rounded w-12"></div>
        </div>
      </div>
      
      {/* Tabs skeleton */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b">
          <div className="flex space-x-8 px-6">
            <div className="h-10 bg-gray-300 rounded w-20"></div>
            <div className="h-10 bg-gray-300 rounded w-20"></div>
            <div className="h-10 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
        <div className="p-6">
          <VideoFeedSkeleton count={6} />
        </div>
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="h-5 bg-gray-300 rounded w-24 mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-300 rounded w-full mb-1"></div>
                <div className="h-2 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex space-x-3 p-4">
        {/* Avatar skeleton */}
        <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
        {/* Comment content skeleton */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-3 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded"></div>
            <div className="h-3 bg-gray-300 rounded w-5/6"></div>
            <div className="h-3 bg-gray-300 rounded w-4/6"></div>
          </div>
          <div className="flex items-center space-x-4 mt-3">
            <div className="h-3 bg-gray-300 rounded w-8"></div>
            <div className="h-3 bg-gray-300 rounded w-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} border-2 border-gray-200 border-t-purple-600 rounded-full animate-spin`}></div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Navbar skeleton */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="h-8 bg-gray-300 rounded w-32"></div>
            <div className="flex items-center space-x-4">
              <div className="h-8 bg-gray-300 rounded w-16"></div>
              <div className="h-8 bg-gray-300 rounded w-16"></div>
              <div className="h-8 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 bg-gray-300 rounded w-48 mb-8"></div>
        <VideoFeedSkeleton />
      </div>
    </div>
  );
}
