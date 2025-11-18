import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,.25),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,.2),transparent_30%)]" />
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-8 md:pt-16 md:pb-14 grid md:grid-cols-2 gap-8 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Discover products that spark joy
          </h1>
          <p className="mt-4 text-slate-300 text-lg">
            Curated tech and lifestyle goods with smooth animations and vibrant visuals.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#products" className="inline-flex items-center px-5 py-3 rounded-xl bg-white text-slate-900 font-medium hover:bg-slate-200 transition">Shop now</a>
            <a href="#about" className="inline-flex items-center px-5 py-3 rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-800 transition">Learn more</a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: .95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: .6, delay: .1 }}
          className="relative"
        >
          <div className="rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
            <img src="https://images.unsplash.com/photo-1513384312027-9fa69a360337?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxIZXJvfGVufDB8MHx8fDE3NjM0NTU5MDR8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80" alt="Hero" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-3xl bg-cyan-500/20 blur-3xl" />
          <div className="absolute -top-6 -right-6 w-40 h-40 rounded-3xl bg-blue-500/20 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
