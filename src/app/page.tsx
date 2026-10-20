import { Launch } from "@/components/launch";
import { resolveImages } from "@/lib/images";

export default function HomePage() {
  return <Launch images={resolveImages()} />;
}
