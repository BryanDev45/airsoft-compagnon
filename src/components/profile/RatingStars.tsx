
import React from 'react';
import { Star, StarHalf, StarOff } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ 
  rating, 
  onRatingChange, 
  readonly = false,
  size = 24
}) => {
  const calculateStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star
            key={i}
            className={`text-yellow-400 ${!readonly && 'cursor-pointer hover:scale-110 transition-transform'}`}
            size={size}
            onClick={() => !readonly && onRatingChange?.(i)}
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <StarHalf
            key={i}
            className={`text-yellow-400 ${!readonly && 'cursor-pointer hover:scale-110 transition-transform'}`}
            size={size}
            onClick={() => !readonly && onRatingChange?.(i - 0.5)}
          />
        );
      } else {
        stars.push(
          <StarOff
            key={i}
            className={`text-gray-300 ${!readonly && 'cursor-pointer hover:scale-110 transition-transform'}`}
            size={size}
            onClick={() => !readonly && onRatingChange?.(i)}
          />
        );
      }
    }
    return stars;
  };

  return (
    <div className="flex gap-1">
      {calculateStars()}
    </div>
  );
};

export default RatingStars;
