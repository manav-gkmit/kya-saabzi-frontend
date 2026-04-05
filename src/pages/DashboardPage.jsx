import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { getMyCooklogs } from "../api/services";
import { getCurrentMealType } from "../utils/mealType";

const KITCHEN_TIPS = [
  { title: "Batch Cooking Tip", text: "Cook twice as much rice today and use the leftovers for fried rice tomorrow. It saves time and energy!" },
  { title: "Herb Freshness", text: "Store cilantro and parsley like flowers in a glass of water to keep them fresh for up to two weeks." },
  { title: "Spice Bloom", text: "Always toast your dry spices in a little oil before adding liquids to unlock their full flavor profile." },
  { title: "Easy Peeling", text: "To peel ginger easily, use a spoon instead of a knife. It gets around the curves without wasting the root." },
  { title: "Knife Safety", text: "A sharp knife is safer than a dull one. It requires less pressure and won't slip as easily." }
];

const FOOD_QUOTES = [
  { author: "Craig Claiborne", text: "Cooking is at once child's play and adult joy. And cooking done with care is an act of love." },
  { author: "Julia Child", text: "People who love to eat are always the best people." },
  { author: "Virginia Woolf", text: "One cannot think well, love well, sleep well, if one has not dined well." },
  { author: "J.R.R. Tolkien", text: "If more of us valued food and cheer and song above hoarded gold, it would be a merrier world." },
  { author: "Ina Garten", text: "You can be miserable before you have a cookie, and you can be miserable after you eat a cookie, but you can never be miserable while you are eating a cookie." }
];

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ count: 0, favorite: "Your first dish" });
  const [dailyTip, setDailyTip] = useState(KITCHEN_TIPS[0]);
  const [dailyQuote, setDailyQuote] = useState(FOOD_QUOTES[0]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    // Select random tip and quote on mount
    setDailyTip(KITCHEN_TIPS[Math.floor(Math.random() * KITCHEN_TIPS.length)]);
    setDailyQuote(FOOD_QUOTES[Math.floor(Math.random() * FOOD_QUOTES.length)]);

    const fetchStats = async () => {
      try {
        const { data: rawData } = await getMyCooklogs();
        const data = rawData ? rawData.filter(log => !log.deleted_at) : [];

        if (data.length > 0) {
          // Count total
          const count = data.length;

          // Find most frequent dish
          const counts = {};
          data.forEach(log => {
            const name = log.dish?.name;
            if (name) {
              counts[name] = (counts[name] || 0) + 1;
            }
          });

          const countKeys = Object.keys(counts);
          const favorite = countKeys.length > 0
            ? countKeys.reduce((a, b) => counts[a] > counts[b] ? a : b)
            : "—";

          setStats({ count, favorite });
        } else {
          setStats({ count: 0, favorite: "—" });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 22) return "Good Evening";
    return "Good Late Night";
  };

  const mealType = getCurrentMealType();
  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  return (
    <div className="relative min-h-[90vh] py-8 md:py-16 flex flex-col gap-12 overflow-visible">

      {/* Decorative Background Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--color-primary-light)] opacity-30 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="absolute top-1/2 -left-48 w-[30rem] h-[30rem] bg-[var(--color-secondary-light)] opacity-20 rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* Friendly Header Section */}
      <div className="flex flex-col gap-3 relative z-10 spell-fade-up">
        <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/40 shadow-sm w-fit mb-2">
          <span className="text-[var(--color-primary)] text-sm font-bold uppercase tracking-widest leading-none">Family Dashboard</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-extrabold text-[var(--color-text-main)] tracking-tight leading-[1.1]">
          {getGreeting()}, <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]">{user?.username || "Friend"}</span> <span className="inline-block animate-pulse">✨</span>
        </h1>
        <p className="font-sans text-xl md:text-2xl text-[var(--color-text-muted)] font-medium max-w-2xl">
          Everything you need to keep the family happy, healthy, and well-fed.
        </p>
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

        {/* Primary Action Card - Redesigned for Premium Side-by-Side */}
        <div className="lg:col-span-8">
          <Link to="/recommend" className="soft-card flex flex-col md:flex-row overflow-hidden group h-full border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] ring-1 ring-black/5 hover:ring-[var(--color-primary)]/10 transition-all duration-500 spell-fade-up" style={{ animationDelay: '0.1s' }}>

            {/* Image Section - Left Panel */}
            <div className="md:w-1/2 relative overflow-hidden">
              <div className="absolute inset-0 bg-slate-100 animate-pulse"></div>
              <img
                src="/recommendations_card_1775214035028.png"
                alt="Fresh ingredients"
                className="w-full h-full object-cover relative z-10 transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/10 to-transparent md:block hidden"></div>
            </div>

            {/* Content Section - Right Panel */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center gap-6 bg-white relative">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-[var(--color-primary)] rounded-full"></span>
                  <span className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-[0.2em]">Featured Suggestion</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-display font-black text-[var(--color-text-main)] tracking-tight leading-[1.1]">
                  What's for <br />
                  <span className="text-[var(--color-primary)]">{capitalize(mealType)} {mealType === 'dinner' ? 'tonight' : 'today'}?</span>
                </h2>

                <p className="font-sans text-lg text-[var(--color-text-muted)] font-medium leading-relaxed">
                  Stuck in a recipe rut? Get a personalized {mealType} plan curated just for your family's unique tastes.
                </p>
              </div>

              <div className="flex flex-col gap-4 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-3 text-sm font-bold text-[var(--color-text-main)]">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-success-light)] text-[var(--color-success)] flex items-center justify-center text-xs">✓</div>
                  <span>AI-Powered Matching</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-[var(--color-text-main)]">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-secondary-light)] text-[var(--color-secondary)] flex items-center justify-center text-xs">✓</div>
                  <span>Nutritionally Balanced</span>
                </div>
              </div>

              <div className="mt-4">
                <span className="btn-primary w-full md:w-fit group-hover:px-12 transition-all duration-300 shadow-xl shadow-rose-100">
                  Plan My Meal <span className="text-xl">→</span>
                </span>
              </div>
            </div>

          </Link>
        </div>

        {/* Secondary Actions Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-8">

          {/* Quick Actions Card */}
          <div className="soft-card p-10 bg-gradient-to-br from-white to-slate-50 relative overflow-hidden group border-none shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] spell-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[var(--color-secondary-light)] opacity-40 rounded-full group-hover:scale-150 transition-transform duration-700"></div>

            <h3 className="text-sm font-black text-[var(--color-text-muted)] uppercase tracking-[0.2em] mb-8">Quick Entry</h3>

            <div className="flex flex-col gap-4">
              <Link to="/dishes" className="flex items-center gap-5 p-5 bg-white rounded-2xl border-2 border-transparent hover:border-[var(--color-primary-light)] hover:shadow-lg transition-all duration-300 group/item">
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center shrink-0 group-hover/item:rotate-12 transition-transform">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-lg text-[var(--color-text-main)] group-hover/item:text-[var(--color-primary)] transition-colors">Log Meal</span>
                  <span className="text-sm font-medium text-[var(--color-text-muted)] leading-tight">Save a recipe you cooked today</span>
                </div>
              </Link>

              <Link to="/cooklogs" className="flex items-center gap-5 p-5 bg-white rounded-2xl border-2 border-transparent hover:border-[var(--color-secondary-light)] hover:shadow-lg transition-all duration-300 group/item">
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-secondary-light)] text-[var(--color-secondary)] flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-lg text-[var(--color-text-main)] group-hover/item:text-[var(--color-secondary)] transition-colors">History</span>
                  <span className="text-sm font-medium text-[var(--color-text-muted)] leading-tight">View your kitchen chronicles</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Family Preferences Summary */}
          <Link to="/settings" className="soft-card p-10 bg-[var(--color-accent-light)]/30 border-none hover:bg-[var(--color-accent-light)] group overflow-hidden relative spell-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-accent)] opacity-5 rounded-bl-full -mr-4 -mt-4 group-hover:scale-150 transition-transform duration-700"></div>

            <div className="flex flex-col gap-6 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white text-[var(--color-accent)] flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-[var(--color-text-main)] mb-2">Family Rules</h3>
                <p className="text-sm font-medium text-[var(--color-text-muted)] leading-relaxed">Adjust dietary preferences, spice tolerance, and household members.</p>
              </div>
              <span className="text-[var(--color-accent)] font-bold text-sm tracking-widest uppercase">Manage Kitchen &rarr;</span>
            </div>
          </Link>

        </div>
      </div>

      {/* Tertiary Inspiration Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 spell-fade-up" style={{ animationDelay: '0.4s' }}>
        <div className="bg-white/40 backdrop-blur-md p-8 rounded-3xl border border-white/50 flex flex-col gap-4">
          <span className="w-10 h-10 rounded-full bg-[var(--color-success-light)] text-[var(--color-success)] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </span>
          <h4 className="font-display font-bold text-lg">{dailyTip.title}</h4>
          <p className="font-sans text-sm font-medium text-[var(--color-text-muted)] leading-relaxed">{dailyTip.text}</p>
        </div>

        <div className="bg-white/40 backdrop-blur-md p-8 rounded-3xl border border-white/50 flex flex-col gap-4">
          <span className="w-10 h-10 rounded-full bg-[var(--color-secondary-light)] text-[var(--color-secondary)] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </span>
          <h4 className="font-display font-bold text-lg">Kitchen Archive</h4>
          <p className="font-sans text-sm font-medium text-[var(--color-text-muted)] leading-relaxed">
            {isLoadingStats ? (
              <span className="animate-pulse">Analyzing your chronicles...</span>
            ) : stats.count > 0 ? (
              <>You've logged <span className="text-[var(--color-secondary)] font-black">{stats.count} recipes</span>! Your family's most requested dish is <span className="text-[var(--color-secondary)] font-black">"{stats.favorite}"</span>.</>
            ) : (
              "Start logging recipes to see your family's favorite dishes here!"
            )}
          </p>
        </div>

        <div className="bg-[var(--color-primary)] p-8 rounded-3xl flex flex-col gap-4 text-white shadow-xl shadow-rose-200">
          <h4 className="font-display font-black text-2xl tracking-tight">Cook something new?</h4>
          <p className="font-sans text-sm font-medium opacity-90 leading-relaxed italic">"{dailyQuote.text}" - {dailyQuote.author}</p>
          <Link to="/dishes" className="mt-2 bg-white text-[var(--color-primary)] font-black py-4 px-8 rounded-2xl text-center hover:bg-[var(--color-primary-light)] transition-colors">Log Recipe Now</Link>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
