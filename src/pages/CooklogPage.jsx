import { useState, useEffect } from "react";
import { getMyCooklogs, deleteCooklog } from "../api/services";

const CooklogPage = () => {
  const [cooklogs, setCooklogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchCooklogs = async (currentPage, isInitial = false) => {
    setLoading(true);
    setError(null);
    try {
      const limit = 10;
      const { data } = await getMyCooklogs(limit, currentPage * limit);
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const activeCooklogs = data.filter((log) => !log.deleted_at);
      const recentCooklogs = activeCooklogs.filter(log => new Date(log.created_at) >= thirtyDaysAgo);
      
      if (isInitial) {
        setCooklogs(recentCooklogs);
      } else {
        setCooklogs(prev => [...prev, ...recentCooklogs]);
      }
      
      const latestFetchedLog = data[data.length - 1];
      if (data.length < limit || (latestFetchedLog && new Date(latestFetchedLog.created_at) < thirtyDaysAgo)) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      setError("Failed to fetch past recipes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCooklogs(0, true);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCooklogs(nextPage, false);
  };

  const handleDeleteCooklog = async (cooklogId) => {
    try {
      await deleteCooklog(cooklogId);
      setCooklogs(cooklogs.filter((log) => log.id !== cooklogId));
    } catch (err) {
      setError("Failed to remove recipe.");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-10 py-8 md:py-16 max-w-4xl mx-auto spell-fade-up">
      {/* Friendly Header */}
        <div className="inline-flex items-center gap-2 bg-[var(--color-secondary-light)] text-[var(--color-secondary)] px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wide w-fit mx-auto md:mx-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Kitchen Archive
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-[var(--color-text-main)] tracking-tight mt-2">
          Your Culinary History
        </h1>
        <p className="font-sans text-xl text-[var(--color-text-muted)] font-medium max-w-xl mx-auto md:mx-0">
          A collection of the meals you've prepared for the family.
        </p>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-[var(--color-text-muted)]">
          <div className="w-12 h-12 border-4 border-[var(--color-accent-light)] border-t-[var(--color-accent)] rounded-full animate-spin"></div>
          <p className="font-medium animate-pulse">Loading recipes...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-[var(--color-primary-light)] text-[var(--color-primary)] px-6 py-4 rounded-xl font-bold font-sans text-sm text-center">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cooklogs.length > 0 ? (
          cooklogs.map((log, index) => (
            <div
              key={log.id}
              className="soft-card p-6 rounded-3xl flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 bg-white spell-fade-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex flex-col text-left gap-2 mb-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-sans text-xs font-bold text-[var(--color-secondary)] bg-[var(--color-secondary-light)] px-3 py-1 rounded-full uppercase tracking-wider">
                    {new Date(log.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to remove this recipe?")) {
                        handleDeleteCooklog(log.id);
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                <span className="font-display font-bold text-2xl text-[var(--color-text-main)] leading-tight">{log.dish?.name || "Deleted dish"}</span>
              </div>
              
              {log.note && (
                <div className="mt-2 bg-slate-50 p-4 rounded-2xl flex items-start gap-3">
                  <span className="text-xl shrink-0 mt-0.5">💭</span>
                  <span className="font-sans text-sm text-[var(--color-text-muted)] font-medium leading-relaxed">
                    {log.note}
                  </span>
                </div>
              )}
            </div>
          ))
        ) : !loading && (
          <div className="md:col-span-2 text-center p-12 soft-card border-none bg-slate-50/50">
            <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4 text-4xl">
              🍳
            </div>
            <h3 className="font-display font-bold text-2xl text-[var(--color-text-main)] mb-2">The archive is empty</h3>
            <p className="font-sans text-[var(--color-text-muted)] font-medium mb-6">
              Start logging your meals to build up your family's personal kitchen chronicles.
            </p>
          </div>
        )}
      </div>

      {hasMore && cooklogs.length > 0 && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors rounded-xl font-bold font-sans shadow-md"
          >
            Load Older Recipes
          </button>
        </div>
      )}
    </div>
  );
};

export default CooklogPage;
