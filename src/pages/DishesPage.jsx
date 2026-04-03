import { useState, useEffect } from "react";
import { addDish, searchDishes } from "../api/services";

const DishesPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    note: "",
    rating: 5,
    spiciness: 1,
    meal_type: "lunch",
    dish_type: "veg",
    prep_time_minutes: "",
    calories_estimate: "",
  });

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.name.trim().length > 2) {
        setSearching(true);
        try {
          const { data } = await searchDishes(formData.name);
          setSearchResults(data);
        } catch (err) {
          console.error("Search failed:", err);
        } finally {
          setSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.name]);

  const handleAddDish = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    setLoading(true);
    setError(null);
    setSuccessMessage("");
    try {
      const payload = {
        ...formData,
        prep_time_minutes: formData.prep_time_minutes === "" ? null : Number(formData.prep_time_minutes),
        calories_estimate: formData.calories_estimate === "" ? null : Number(formData.calories_estimate)
      };
      await addDish(payload);
      setSuccessMessage(`Added successfully: ${formData.name}`);
      setFormData({
        name: "",
        note: "",
        rating: 5,
        spiciness: 1,
        meal_type: "lunch",
        dish_type: "veg",
        prep_time_minutes: "",
        calories_estimate: "",
      });
      setSearchResults([]);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      const message =
        err.response?.data?.detail?.[0]?.msg ??
        err.response?.data?.detail ??
        err.message ??
        "Failed to save recipe.";
      setError(typeof message === "string" ? message : "Please double check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-10 py-8 md:py-16 max-w-3xl mx-auto spell-fade-up">
      {/* Friendly Header */}
      <div className="flex flex-col gap-3 text-center md:text-left">
        <div className="inline-flex items-center gap-2 bg-[var(--color-accent-light)] text-[var(--color-accent)] px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wide w-fit mx-auto md:mx-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          The Recipe Book
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-[var(--color-text-main)] tracking-tight mt-2">
          Add a new dish
        </h1>
        <p className="font-sans text-xl text-[var(--color-text-muted)] font-medium max-w-xl mx-auto md:mx-0">
          Chronicle what you cooked today, from the quick lunches to the grand dinners.
        </p>
      </div>

      <form onSubmit={handleAddDish} className="flex flex-col gap-8">
        
        {/* Core Identity */}
        <section className="soft-card p-6 md:p-8 flex flex-col gap-6 relative z-20">
          <label className="font-display font-bold text-sm text-text-main opacity-80 uppercase tracking-wide">What's the recipe?</label>
          <div className="relative">
            <input
              type="text"
              placeholder="E.g., Creamy Tomato Soup"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
              className="input-soft font-display font-bold text-xl md:text-2xl"
            />
            
            {/* Fuzzy Search Results */}
            {searchResults.length > 0 && (
              <div className="absolute top-14 left-0 w-full mt-2 bg-white rounded-xl border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden">
                <div className="p-3 bg-slate-50 border-b border-slate-100 font-sans text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Similar known recipes
                </div>
                {searchResults.map((match) => (
                  <button
                    key={match.id}
                    type="button"
                    onClick={() => {
                      updateField("name", match.name);
                      setSearchResults([]);
                    }}
                    className="w-full text-left p-4 hover:bg-slate-50 flex justify-between items-center transition-colors border-b border-slate-100 last:border-0"
                  >
                    <span className="font-display font-bold text-lg text-[var(--color-text-main)]">{match.name}</span>
                    <span className="bg-[var(--color-success-light)] text-[var(--color-success)] px-2 py-1 rounded text-xs font-bold">{(match.similarity * 100).toFixed(0)}% match</span>
                  </button>
                ))}
              </div>
            )}
            {searching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-[var(--color-secondary-light)] border-t-[var(--color-secondary)] rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </section>

        {/* Classification */}
        <section className="soft-card p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
          <div className="flex flex-col gap-4">
            <label className="font-display font-bold text-sm text-text-main opacity-80 uppercase tracking-wide">Meal time</label>
            <div className="flex flex-wrap gap-2 font-sans font-bold">
              {["breakfast", "lunch", "dinner", "snack"].map((mt) => (
                <button
                  key={mt}
                  type="button"
                  onClick={() => updateField("meal_type", mt)}
                  className={`flex-1 min-w-[45%] py-2.5 px-4 rounded-xl border-2 transition-all capitalize text-sm ${
                    formData.meal_type === mt ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] border-[var(--color-primary-light)]" : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  {mt}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <label className="font-display font-bold text-sm text-text-main opacity-80 uppercase tracking-wide">Diet Type</label>
            <div className="flex flex-wrap gap-2 font-sans font-bold">
              {["veg", "non-veg", "vegan"].map((dt) => (
                <button
                  key={dt}
                  type="button"
                  onClick={() => updateField("dish_type", dt)}
                  className={`flex-1 min-w-[30%] py-2.5 px-4 rounded-xl border-2 transition-all capitalize text-sm ${
                    formData.dish_type === dt ? "bg-[var(--color-success-light)] text-[var(--color-success)] border-[var(--color-success-light)]" : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  {dt}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Sliders Area */}
        <section className="soft-card p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="font-display font-bold text-sm text-text-main opacity-80 uppercase tracking-wide">Spiciness</label>
              <div className="bg-[var(--color-accent-light)] text-[var(--color-accent)] px-3 py-1 rounded-lg text-sm font-bold">
                Level {formData.spiciness}
              </div>
            </div>
            <div className="pt-2 pb-1 relative">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={formData.spiciness}
                onChange={(e) => updateField("spiciness", parseInt(e.target.value))}
                className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="font-display font-bold text-sm text-text-main opacity-80 uppercase tracking-wide">Family rating</label>
              <div className="bg-[var(--color-secondary-light)] text-[var(--color-secondary)] px-3 py-1 rounded-lg text-sm font-bold">
                {formData.rating} Stars
              </div>
            </div>
            <div className="pt-2 pb-1 relative">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={formData.rating}
                onChange={(e) => updateField("rating", parseInt(e.target.value))}
                className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[var(--color-secondary)] focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Narrative & Analytics */}
        <section className="soft-card p-6 md:p-8 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
               <label className="font-display font-bold text-sm text-text-main opacity-80 uppercase tracking-wide">Prep Time (Min)</label>
               <input
                 type="number"
                 placeholder="Optional"
                 value={formData.prep_time_minutes}
                 onChange={(e) => updateField("prep_time_minutes", e.target.value)}
                 className="input-soft text-xl font-bold"
               />
            </div>
            <div className="flex flex-col gap-3">
               <label className="font-display font-bold text-sm text-text-main opacity-80 uppercase tracking-wide">Calories (Est.)</label>
               <input
                 type="number"
                 placeholder="Optional"
                 value={formData.calories_estimate}
                 onChange={(e) => updateField("calories_estimate", e.target.value)}
                 className="input-soft text-xl font-bold"
               />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="font-display font-bold text-sm text-text-main opacity-80 uppercase tracking-wide block mb-3">Kitchen Notes</label>
            <textarea
              placeholder="Any changes you made? What did the kids think?"
              value={formData.note}
              onChange={(e) => updateField("note", e.target.value)}
              rows="4"
              className="input-soft resize-y min-h-[100px]"
            />
          </div>
        </section>

        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 mt-2">
          <span className="font-sans font-medium text-[var(--color-text-muted)] text-center sm:text-left text-sm">
            You can always edit this entry later from the Archive.
          </span>
          <button
            type="submit"
            className="btn-primary w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add to Recipe Book"}
          </button>
        </div>
      </form>

      {/* Floating Notifications */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 flex flex-col gap-4 pointer-events-none z-[100] w-full max-w-md px-4">
        {error && (
          <div className="bg-white px-6 py-4 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border-l-4 border-[var(--color-primary)] animate-in fade-in slide-in-from-top-4 pointer-events-auto w-full">
            <span className="font-display font-bold text-[var(--color-text-main)] block mb-1">Could not save</span>
            <span className="font-sans text-sm font-medium text-[var(--color-text-muted)]">{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="bg-white px-6 py-4 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border-l-4 border-[var(--color-success)] animate-in fade-in slide-in-from-top-4 pointer-events-auto w-full flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[var(--color-success-light)] text-[var(--color-success)] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-[var(--color-text-main)] block mb-1">Added to Book!</span>
              <span className="font-sans text-sm font-medium text-[var(--color-text-muted)]">{successMessage}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DishesPage;
