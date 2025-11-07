import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const BlogCard = ({ imgSrc, name, description, delay }) => (
  <motion.div
    className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-sky-400 hover:bg-white/10 flex flex-col"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="overflow-hidden">
      <img
        src={imgSrc}
        alt={`Blog post about ${name}`}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="mt-2 text-xl font-bold text-white flex-grow">{name}</h3>
      <p className="mt-3 text-slate-400">{description}</p>
      <Link
        to={`/blogs/${name}`}
        className="mt-4 inline-flex items-center font-semibold text-sky-400 hover:text-sky-300 transition-colors self-start"
      >
        Read More <ArrowRight className="w-4 h-4 ml-2" />
      </Link>
    </div>
  </motion.div>
);

const BlogSection = () => {
  const posts = [
    {
      name: "Nail Fungus",
      description:
        "A common infection of the nail that causes it to become discolored, thickened, and more likely to crack and break.",
      imgSrc: "https://placehold.co/600x400/1e293b/94a3b8?text=Nail+Fungus",
    },
    {
      name: "Ringworm",
      description:
        "A highly contagious, fungal infection of the skin or scalp, characterized by a ring-shaped rash.",
      imgSrc: "https://placehold.co/600x400/1e293b/94a3b8?text=Ringworm",
    },
    {
      name: "Shingles",
      description:
        "A viral infection that causes a painful rash. It's caused by the same virus as chickenpox.",
      imgSrc: "https://placehold.co/600x400/1e293b/94a3b8?text=Shingles",
    },
  ];
  return (
    <section id="blogs" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Learn About Skin Health
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            Explore our blog for articles on skin care, condition explanations,
            and wellness tips.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {posts.map((post, index) => (
            <BlogCard key={index} {...post} delay={index * 0.15} />
          ))}
          <motion.div
            className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-sky-400 hover:bg-white/10 flex"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <Link
              to="/blogs"
              className="flex flex-col items-center justify-center text-center p-6 w-full"
            >
              <div className="text-4xl text-sky-400 transition-transform duration-300 group-hover:scale-110">
                <ArrowRight />
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">
                View All Posts
              </h3>
              <p className="mt-2 text-slate-400">
                Explore our full library of articles.
              </p>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default BlogSection;
