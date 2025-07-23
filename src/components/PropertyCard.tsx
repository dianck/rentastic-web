import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";

type PropertyCardProps = {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  imageUrl: string;
  imageHint: string;
};

export function PropertyCard({ id, name, location, price, rating, imageUrl, imageHint }: PropertyCardProps) {
  return (
    <Link href={`/properties/${id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-xl duration-300 group">
        <div className="relative">
          <Image
            src={imageUrl}
            alt={name}
            width={400}
            height={300}
            className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={imageHint}
          />
          <Badge className="absolute top-3 right-3" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>FEATURED</Badge>
        </div>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-headline font-semibold text-lg truncate">{name}</h3>
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{location}</span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <p className="text-lg font-bold text-primary">
              ${price}<span className="text-sm font-normal text-muted-foreground">/night</span>
            </p>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-bold">{rating.toFixed(1)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
