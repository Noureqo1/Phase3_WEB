'use client';

import { useState } from 'react';
import apiClient from '@/lib/services/api';

interface ReviewFormProps {
  videoId: string;
  onSubmit: (review: any) => void;
  onCancel?: () => void;
  existingReview?: any;
}

export default function ReviewForm({ videoId, onSubmit, onCancel, existingReview }: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    // Check if user is authenticated
    const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
    if (!token) {
      setError('Please log in to submit a review');
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient({
        method: existingReview ? 'PATCH' : 'POST',
        url: `/videos/${videoId}/reviews`,
        data: { rating, comment }
      });

      onSubmit(response.data.data);
      if (!existingReview) {
        setRating(0);
        setComment('');
      }
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('You have already reviewed this video');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to submit review');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </h3>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-3xl transition ${
                rating >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this video..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          rows={4}
        />
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="flex gap-3">
        {existingReview && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-400"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
        >
          {loading ? 'Submitting...' : (existingReview ? 'Update Review' : 'Submit Review')}
        </button>
      </div>
    </form>
  );
}
