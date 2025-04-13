
import { Link } from "react-router-dom";
import { Gig } from "@/types";
import RatingStars from "@/components/ui/RatingStars";

interface GigCardProps {
  gig: Gig;
}

export default function GigCard({ gig }: GigCardProps) {
  return (
    <Link to={`/gigs/${gig.id}`} className="block">
      <div className="gig-card h-full flex flex-col">
        <div className="relative h-48 w-full">
          <img
            src={gig.image || "/placeholder.svg"}
            alt={gig.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <div className="flex items-center mb-2">
            <img
              src={gig.sellerAvatar || "/placeholder.svg"}
              alt={gig.sellerName}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-sm font-medium">{gig.sellerName}</span>
          </div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{gig.title}</h3>
          <div className="flex items-center mt-auto">
            {gig.rating && (
              <div className="flex items-center">
                <RatingStars rating={gig.rating} />
                <span className="ml-1 text-sm text-gray-600">
                  ({gig.reviewCount})
                </span>
              </div>
            )}
          </div>
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Starting at</span>
              <span className="font-bold text-lg">${gig.price}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
