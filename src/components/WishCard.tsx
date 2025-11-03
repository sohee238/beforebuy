import { Wish } from '../types';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface WishCardProps {
  wish: Wish;
  onClick?: () => void;
}

export function WishCard({ wish, onClick }: WishCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="aspect-video relative overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={wish.image}
          alt={wish.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2">{wish.name}</h3>
        <p className="text-blue-600">₩{wish.price.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}
