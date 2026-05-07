'use client';

import { useEffect, useRef } from 'react';

interface TestVideoPlayerProps {
  videoUrl: string;
}

export default function TestVideoPlayer({ videoUrl }: TestVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const logVideoState = () => {
      console.log('Video networkState:', video.networkState);
      console.log('Video readyState:', video.readyState);
      console.log('Video error:', video.error);
      console.log('Video currentSrc:', video.currentSrc);
    };

    video.addEventListener('loadstart', logVideoState);
    video.addEventListener('loadeddata', logVideoState);
    video.addEventListener('canplay', logVideoState);
    video.addEventListener('error', logVideoState);

    return () => {
      video.removeEventListener('loadstart', logVideoState);
      video.removeEventListener('loadeddata', logVideoState);
      video.removeEventListener('canplay', logVideoState);
      video.removeEventListener('error', logVideoState);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        width="100%"
        height="100%"
        className="w-full h-full"
        preload="metadata"
        crossOrigin="anonymous"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
