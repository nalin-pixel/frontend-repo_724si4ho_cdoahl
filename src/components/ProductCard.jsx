import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function ProductCard({ product, onAdd }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      className="group bg-slate-800/60 border border-slate-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-cyan-500/20 transition-shadow"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image_url}
          alt={product.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-slate-100 font-semibold leading-snug">{product.title}</h3>
          <span className="text-cyan-300 font-semibold">${product.price.toFixed(2)}</span>
        </div>
        <p className="text-slate-400 text-sm line-clamp-2 mt-1">{product.description}</p>
        <div className="flex items-center gap-1 text-amber-400 mt-2">
          <Star className="w-4 h-4 fill-amber-400" />
          <span className="text-sm">{product.rating}</span>
        </div>
        <button
          onClick={() => onAdd(product)}
          className="mt-3 w-full inline-flex justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2.5 font-medium hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/30"
        >
          Add to cart
        </button>
      </div>
    </motion.div>
  );
}
