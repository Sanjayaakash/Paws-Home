import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star, Heart } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const Index = () => {
  const navigate = useNavigate();
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary selection:text-black">
      <Navigation />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen pt-32 px-4 md:px-8 lg:px-16 flex flex-col justify-center">
        <div className="max-w-[1800px] mx-auto w-full grid lg:grid-cols-12 gap-8 items-center">

          {/* Main Tipography Block */}
          <div className="lg:col-span-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-primary text-black px-4 py-1 inline-block mb-6 font-bold tracking-widest text-xs uppercase"
            >
              Est. 2024 • Pet Lifestyle
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h1 className="text-giant font-black leading-[0.85] text-white mix-blend-overlay">
                FIND YOUR <br />
                <span className="text-primary italic font-script pr-4">Dream</span>
                PET
              </h1>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 0.5, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-giant font-black leading-[0.85] text-outline-white opacity-50"
            >
              OR A NEW
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col md:flex-row items-baseline gap-4"
            >
              <h1 className="text-giant font-black leading-[0.85] text-white">
                BEST <span className="text-primary font-script italic text-8xl md:text-9xl ml-4">Friend</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-12 flex flex-col sm:flex-row gap-6"
            >
              <Button
                size="lg"
                onClick={() => navigate("/adopt")}
                className="bg-primary text-black border-2 border-primary rounded-none h-16 px-12 text-xl font-bold uppercase hover:bg-transparent hover:text-primary transition-all hover:scale-105"
              >
                Find a Friend <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/features")}
                className="border-2 border-white/20 text-white rounded-none h-16 px-12 text-xl font-bold uppercase hover:bg-white hover:text-black transition-all hover:scale-105"
              >
                Learn More
              </Button>
            </motion.div>
          </div>

          {/* Hero Image / Editorial Cutout */}
          <div className="lg:col-span-4 relative mt-12 lg:mt-0">
            <motion.div
              ref={targetRef}
              style={{ opacity, scale, y }}
              className="relative"
            >
              <div className="absolute -top-10 -right-10 w-full h-full border-4 border-primary z-0 hidden lg:block"></div>
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "circOut" }}
                src="https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Editorial Cat"
                className="w-full h-[600px] object-cover grayscale contrast-125 z-10 relative shadow-2xl img-sharp"
              />

              {/* Floating Badge */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="absolute bottom-10 -left-10 bg-black/80 backdrop-blur-md p-6 border border-primary/30 max-w-xs z-20 hidden md:block"
              >
                <p className="text-primary font-bold text-xs uppercase mb-2">Editor's Pick</p>
                <p className="text-white font-display text-2xl leading-none">
                  "Unconditional love waiting for you."
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- SCROLLING TEXT --- */}
      <div className="w-full overflow-hidden bg-primary py-4 transform -rotate-1 origin-left scale-105 border-y-4 border-black">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="whitespace-nowrap flex gap-12 text-black font-black text-4xl uppercase items-center"
        >
          {Array(8).fill("").map((_, i) => (
            <div key={i} className="flex items-center gap-12">
              <span>New Arrivals</span> <Star className="fill-black" />
              <span>Adopt Don't Shop</span> <Star className="fill-black" />
              <span>Premium Care</span> <Star className="fill-black" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* --- THE GALLERY --- */}
      <section className="py-32 px-4 bg-background relative">
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -200]) }}
          className="absolute top-20 right-20 text-white/5 font-display text-[20rem] leading-none select-none pointer-events-none"
        >
          MEOW
        </motion.div>

        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-white/10 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-primary font-bold tracking-widest mb-4">NECESSARY SUPPLIES</p>
              <h2 className="text-7xl md:text-9xl font-black text-white uppercase leading-none">
                The <span className="font-script text-primary lowercase">Pet</span> Gallery
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-md text-right mt-10 md:mt-0"
            >
              <p className="text-muted-foreground text-lg">
                Explore our curated collection of lovable companions waiting for their forever homes.
                Unique personalities, endless love.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Grid Item 1 (Large) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2 relative group cursor-pointer overflow-hidden border border-white/10"
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all z-10 duration-500"></div>
              <img
                src="https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg?auto=compress&cs=tinysrgb&w=800"
                className="w-full h-[600px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out transform group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 p-8 z-20 w-full bg-gradient-to-t from-black to-transparent">
                <h3 className="text-5xl font-black text-white mb-2">LUNA & ARTEMIS</h3>
                <div className="flex justify-between items-end border-t border-white/30 pt-4">
                  <p className="text-primary font-bold">Bonded Pair • 3 Years</p>
                  <ArrowRight className="text-white hover:text-primary transition-colors w-8 h-8" />
                </div>
              </div>
            </motion.div>

            {/* Grid Item 2 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative group cursor-pointer overflow-hidden border border-white/10"
            >
              <div className="absolute top-4 right-4 z-20 bg-primary text-black font-bold px-3 py-1">NEW</div>
              <img
                src="https://images.pexels.com/photos/1543793/pexels-photo-1543793.jpeg?auto=compress&cs=tinysrgb&w=800"
                className="w-full h-full object-cover min-h-[400px] grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/60 backdrop-blur-sm">
                <h3 className="text-4xl font-black text-white">OLIVER</h3>
                <p className="text-primary italic font-script text-2xl">The Gentleman</p>
              </div>
            </motion.div>

            {/* Grid Item 3 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="relative group cursor-pointer overflow-hidden border border-white/10"
            >
              <img
                src="https://images.pexels.com/photos/1276553/pexels-photo-1276553.jpeg?auto=compress&cs=tinysrgb&w=800"
                className="w-full h-[500px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="p-6 bg-card border-t border-white/10 absolute bottom-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-3xl font-black text-white">SIMBA</h3>
                <p className="text-muted-foreground">Orange Tabby • Energetic</p>
              </div>
            </motion.div>

            {/* Grid Item 4 (Text Block) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-primary p-10 flex flex-col justify-between group hover:bg-white transition-colors duration-500"
            >
              <Star className="w-12 h-12 text-black/20 group-hover:text-black transition-colors animate-spin-slow" />
              <div>
                <h3 className="text-5xl font-black text-black leading-none mb-6">
                  LOOKING <br /> FOR <br /> LOVE?
                </h3>
                <p className="text-black font-bold mb-6">
                  We have dogs, cats, rabbits, and emotional support rocks too.
                </p>
                <Button variant="outline" className="w-full border-black text-black hover:bg-black hover:text-white rounded-none border-2 font-bold uppercase h-12">
                  Browse All Pets
                </Button>
              </div>
            </motion.div>

            {/* Grid Item 5 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative group cursor-pointer overflow-hidden border border-white/10"
            >
              <img
                src="https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=800"
                className="w-full h-[500px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute top-4 left-4 z-20">
                <Heart className="text-white fill-white/20 hover:text-primary hover:fill-primary transition-colors w-8 h-8" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- INFO SECTION --- */}
      <section className="py-24 bg-[#1A221E] border-y border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, rotate: -5 }}
            whileInView={{ opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <img
              src="https://images.pexels.com/photos/1314550/pexels-photo-1314550.jpeg?auto=compress&cs=tinysrgb&w=800"
              className="grayscale contrast-125 border-8 border-white/5 shadow-2xl skew-x-3 hover:skew-x-0 transition-transform duration-500"
            />
          </motion.div>
          <div className="space-y-8">
            <h2 className="text-7xl font-black text-white leading-none">
              HAVE A <span className="text-outline-white">LOOK</span> <br />
              <span className="text-primary">AROUND</span>
            </h2>
            <p className="text-xl text-gray-400 font-medium max-w-lg">
              Our facility is designed to prioritize animal welfare. Every pet has a comfortable space, regular playtime, and top-tier medical attention.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {['Vaccinated', 'Microchipped', 'Trained', 'Loved'].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 border border-white/10 p-4 hover:border-primary transition-colors"
                >
                  <div className="w-3 h-3 bg-primary"></div>
                  <span className="font-bold text-white uppercase tracking-wider">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA FOOTER --- */}
      <section className="py-32 bg-primary px-4 text-center overflow-hidden">
        <motion.h2
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-giant font-black text-black leading-[0.8]"
        >
          SHOP <br />
          <span className="text-white text-outline-black">ADOPT</span> <br />
          LOVE
        </motion.h2>
        <div className="mt-12">
          <p className="text-2xl font-bold text-black mb-8">What are you waiting for?</p>
          <Button className="bg-black text-white text-2xl px-16 py-8 h-auto rounded-none uppercase font-black hover:scale-105 transition-transform hover:bg-white hover:text-black">
            Start Your Journey
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
