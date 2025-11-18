import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import hero1 from "../assets/home1.png";
import hero2 from "../assets/home2.png";

export default function Home() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="flex flex-col items-center text-center space-y-24">
      {/* 🟠 Hero Section 1 (Text + Image) */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="relative w-full bg-gradient-to-br from-orange-50 to-white overflow-hidden py-20 md:py-28"
      >
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-16 gap-12">
          {/* Left Side: Text */}
          <div className="flex flex-col justify-center items-start text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold text-neutral-900 leading-tight drop-shadow-sm max-w-xl">
              Empowering <br />{" "}
              <span className="bg-gradient-to-r from-[#FF9900] to-[#FF6A00] bg-clip-text text-transparent">
                Amazon Sellers
              </span>
            </h1>
            <p className="mt-4 text-lg text-neutral-700 max-w-md">
              Maximize your revenue with our powerful automation tools and expert
              support.
            </p>
            <button className="mt-6 bg-gradient-to-r from-[#FF9900] to-[#FF6A00] text-white font-semibold px-6 py-3 rounded-full shadow hover:scale-105 transition-transform flex items-center gap-2">
              Get Started <ArrowRight size={18} />
            </button>
          </div>

          {/* Right Side: Image */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex justify-center w-full md:w-1/2"
          >
            <img
              src={hero1}
              alt="Empowering Amazon Sellers"
              className="w-[90%] max-w-[500px] object-contain drop-shadow-sm"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* 🟠 Hero Section 2 */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="relative w-full bg-white"
      >
        <img
          src={hero2}
          alt="Automate & Recover Amazon FBA Reimbursements"
          className="w-full object-cover max-h-[650px]"
        />

        <div className="absolute inset-0 flex flex-col justify-center items-start pl-10 md:pl-24 text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg max-w-xl">
            Automate & Recover <br /> Amazon FBA Reimbursements
          </h2>
          <p className="mt-4 text-lg text-orange-50 max-w-md">
            Save time and maximize your profits with our powerful automation
            platform.
          </p>
          <button className="mt-6 bg-white text-orange-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-orange-50 hover:scale-105 transition-transform flex items-center gap-2">
            Get Started <ArrowRight size={18} />
          </button>
        </div>
      </motion.section>

      {/* 🧩 Features Section */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="max-w-6xl px-6 mt-10"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FF9900] to-[#FF6A00] bg-clip-text text-transparent mb-10">
          All-in-One Amazon Platform
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          {[
            {
              title: "Track Inbound Shipments",
              desc: "Monitor and get alerts for lost or damaged goods automatically through SP-API.",
            },
            {
              title: "Identify Reimbursement Claims",
              desc: "Our automation finds every eligible reimbursement — instantly and accurately.",
            },
            {
              title: "Grow Your FBA Revenue",
              desc: "Recover more money and watch your profits soar — no manual effort needed.",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="bg-white p-6 rounded-3xl shadow hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold text-orange-700 mb-2">
                {card.title}
              </h3>
              <p className="text-neutral-600">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 🟢 CTA Section */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="text-center bg-gradient-to-r from-[#FF9900]/10 to-[#FF6A00]/10 py-20 px-6 w-full"
      >
        <h2 className="text-3xl font-bold mb-4 text-neutral-800">
          Start Your Free FBA Audit Today
        </h2>
        <p className="text-neutral-700 mb-8 max-w-2xl mx-auto">
          Discover lost revenue opportunities and recover what Amazon owes you — completely risk-free.
        </p>
        <button className="bg-gradient-to-r from-[#FF9900] to-[#FF6A00] text-white font-medium px-8 py-3 rounded-full shadow hover:scale-105 transition-transform">
          Start Free Audit
        </button>
      </motion.section>
    </div>
  );
}
