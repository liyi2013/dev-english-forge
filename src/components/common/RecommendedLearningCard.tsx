import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { RecommendedLearning } from "@/types/interview";

export function RecommendedLearningCard({ item }: { item: RecommendedLearning }) {
  return (
    <Link
      to={item.to}
      className="panel p-4 hover:border-primary/40 hover:shadow-sm transition cursor-pointer block"
    >
      <span className="chip-blue">{item.tag}</span>
      <h5 className="mt-2 text-sm font-semibold">{item.title}</h5>
      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{item.time}</span>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </Link>
  );
}
