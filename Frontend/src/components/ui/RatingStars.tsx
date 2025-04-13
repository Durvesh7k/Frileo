
import { Star, StarHalf } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
}

export default function RatingStars({
  rating,
  maxRating = 5,
  size = 16,
  className = "",
}: RatingStarsProps) {
  // Calculate the number of filled, half, and empty stars
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - filledStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(filledStars)].map((_, i) => (
        <Star
          key={`filled-${i}`}
          size={size}
          className="text-yellow-400 fill-yellow-400"
        />
      ))}
      
      {hasHalfStar && (
        <StarHalf
          size={size}
          className="text-yellow-400 fill-yellow-400"
        />
      )}
      
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          size={size}
          className="text-gray-300"
        />
      ))}
    </div>
  );
}
