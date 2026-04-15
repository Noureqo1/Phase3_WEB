'use client';

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

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: string;
  isOwner: boolean;
}

export default function ReviewList({ reviews, currentUserId, isOwner }: ReviewListProps) {
  if (reviews.length === 0) {
    return <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review._id} className="border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-semibold text-gray-900">
                {review.user.firstName} {review.user.lastName}
              </p>
              <div className="flex gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
                {[...Array(5 - review.rating)].map((_, i) => (
                  <span key={i} className="text-gray-300">★</span>
                ))}
              </div>
            </div>
            {(currentUserId === review.user._id || isOwner) && (
              <button className="text-red-600 hover:text-red-800 text-sm">
                Delete
              </button>
            )}
          </div>
          <p className="text-gray-700">{review.comment}</p>
          <p className="text-xs text-gray-500 mt-2">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
