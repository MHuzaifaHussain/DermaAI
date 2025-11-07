import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Search,
  Phone,
  Star,
  AlertTriangle,
  Loader,
} from "lucide-react";
import toast from "react-hot-toast";
import { mockDoctors } from "../data/mockDoctors";

const DoctorCard = ({ doctor, delay }) => (
  <motion.div
    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-sky-400 hover:bg-white/10"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <h3 className="text-xl font-bold text-white">{doctor.name}</h3>
    <p className="text-slate-400 mt-2 flex items-center gap-2">
      <MapPin size={16} /> {doctor.address}
    </p>
    <div className="flex justify-between items-center mt-4">
      <a
        href={`tel:${doctor.phone}`}
        className="text-sky-400 hover:text-sky-300 flex items-center gap-2 transition-colors"
      >
        <Phone size={16} /> {doctor.phone || "N/A"}
      </a>
      <div className="flex items-center gap-1 text-yellow-400 font-bold">
        <Star size={16} fill="currentColor" />
        <span>{doctor.rating || "N/A"}</span>
      </div>
    </div>
  </motion.div>
);

const getRandomDoctors = (doctors, count) => {
  const shuffled = [...doctors].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const FindDoctorPage = () => {
  const [dermatologists, setDermatologists] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries"
        );
        const data = await response.json();
        if (!data.error) {
          const sortedCountries = data.data.sort((a, b) =>
            a.country.localeCompare(b.country)
          );
          setCountries(sortedCountries);
        }
      } catch (e) {
        toast.error("Could not load country data.");
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      setIsCitiesLoading(true);
      setCities([]);
      setSelectedCity("");

      const fetchCities = async () => {
        try {
          const response = await fetch(
            "https://countriesnow.space/api/v0.1/countries/population/cities/filter",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                limit: 1000,
                order: "asc",
                orderBy: "name",
                country: selectedCountry,
              }),
            }
          );
          const data = await response.json();
          if (!data.error && data.data.length > 0) {
            const cityNames = data.data.map((item) => item.city);
            setCities(cityNames);
          } else {
            toast.error(`Could not find cities for ${selectedCountry}.`);
          }
        } catch (e) {
          toast.error("Could not load city data.");
        } finally {
          setIsCitiesLoading(false);
        }
      };
      fetchCities();
    } else {
      setCities([]);
      setSelectedCity("");
    }
  }, [selectedCountry]);

  const performMockSearch = () => {
    setStatus("loading");
    setError("");
    setDermatologists([]);

    setTimeout(() => {
      try {
        const results = getRandomDoctors(mockDoctors, 5);
        if (results && results.length > 0) {
          setDermatologists(results);
          setStatus("success");
          toast.success(`Found ${results.length} dermatologists.`);
        } else {
          setError("No dermatologists found in the mock data.");
          setStatus("error");
          toast.error("No dermatologists found.");
        }
      } catch (err) {
        setError("An unexpected error occurred while loading mock data.");
        setStatus("error");
      }
    }, 1000);
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!selectedCity || !selectedCountry) {
      toast.error("Please select a country and a city.");
      return;
    }
    performMockSearch();
  };

  const handleNearMeSearch = () => {
    performMockSearch();
  };

  const selectClasses =
    "w-full bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-white p-3";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c111f] to-[#1a202c] text-white">
      <main className="container mx-auto px-6 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            Find a Dermatologist
          </h1>
          <p className="text-lg text-slate-400 mt-4 max-w-3xl mx-auto">
            Search for qualified dermatologists by city or use your current
            location.
          </p>
        </motion.div>

        {/* Search Options */}
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Manual Search */}
          <form
            onSubmit={handleManualSearch}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className={selectClasses}
              >
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c.iso3 || c.country} value={c.country}>
                    {c.country}
                  </option>
                ))}
              </select>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedCountry || isCitiesLoading}
                className={selectClasses}
              >
                <option value="">
                  {isCitiesLoading ? "Loading cities..." : "Select City"}
                </option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full inline-flex items-center justify-center gap-2 font-bold text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 bg-slate-700 hover:bg-slate-600 px-8 py-3 disabled:opacity-50"
            >
              {status === "loading" && selectedCity ? (
                <Loader className="animate-spin" />
              ) : (
                <Search size={20} />
              )}
              Search Manually
            </button>
          </form>

          <div className="flex items-center text-center">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="flex-shrink mx-4 text-slate-400">OR</span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>

          {/* Near Me Search */}
          <div className="flex justify-center">
            <button
              onClick={handleNearMeSearch}
              disabled={status === "loading"}
              className="inline-flex items-center gap-3 font-bold text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-r from-blue-500 to-teal-400 text-lg px-8 py-4 disabled:opacity-50"
            >
              {status === "loading" ? (
                <>
                  <Loader className="animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <MapPin size={22} />
                  Find Near Me
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mt-16 max-w-3xl mx-auto">
          <AnimatePresence>
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-lg flex items-center justify-center gap-4"
              >
                <AlertTriangle />
                <span>{error}</span>
              </motion.div>
            )}

            {status === "success" && dermatologists.length > 0 && (
              <div className="space-y-6">
                {dermatologists.map((doc, index) => (
                  <DoctorCard
                    key={doc.phone}
                    doctor={doc}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default FindDoctorPage;
