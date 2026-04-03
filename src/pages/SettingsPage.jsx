import { useState, useEffect } from "react";
import { getMyHousehold, updateMyHousehold, getHouseholdMembers, joinHousehold } from "../api/services";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const SettingsPage = () => {
  const [household, setHousehold] = useState(null);
  const [localPrefs, setLocalPrefs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [members, setMembers] = useState([]);
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinStatus, setJoinStatus] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.id === household?.admin_id;

  useEffect(() => {
    let cancelled = false;
    const fetchHousehold = async () => {
      try {
        const { data } = await getMyHousehold();
        if (!cancelled) {
          setHousehold(data);
          setLocalPrefs(data.preferences || {});
        }
      } catch (err) {
        console.error("Failed to fetch household", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const fetchMembers = async () => {
      try {
        const { data } = await getHouseholdMembers();
        if (!cancelled) setMembers(data);
      } catch (err) {
        console.error("Failed to fetch members", err);
      }
    };

    fetchHousehold();
    fetchMembers();
    return () => { cancelled = true; };
  }, []);

  const handleLocalUpdate = (newPrefs) => {
    setLocalPrefs((prev) => ({ ...prev, ...newPrefs }));
    setIsDirty(true);
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return;
    setJoining(true);
    setJoinStatus("");
    try {
      await joinHousehold(inviteCodeInput.toUpperCase());
      setJoinStatus("Successfully joined! ✨");
      setInviteCodeInput("");
      // Refresh both household and members
      const { data: hh } = await getMyHousehold();
      setHousehold(hh);
      setLocalPrefs(hh.preferences || {});
      const { data: mems } = await getHouseholdMembers();
      setMembers(mems);
    } catch (err) {
      setJoinStatus(err.response?.data?.detail || "Invalid invite code.");
    } finally {
      setJoining(false);
    }
  };

  const handleSeal = async () => {
    if (!isDirty) { return; }
    setSaving(true);
    setStatus("Saving...");
    try {
      const { data } = await updateMyHousehold({ preferences: localPrefs });
      setHousehold(data);
      setLocalPrefs(data.preferences || {});
      setIsDirty(false);
      setStatus("Preferences saved! ✨");
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      setStatus("Failed to save. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-[var(--color-text-muted)]">
      <div className="w-12 h-12 border-4 border-[var(--color-secondary-light)] border-t-[var(--color-secondary)] rounded-full animate-spin"></div>
      <p className="font-medium animate-pulse">Loading settings...</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-10 py-8 md:py-16 max-w-3xl mx-auto spell-fade-up">
      
      {/* Friendly Header */}
      <div className="flex flex-col gap-3 text-center md:text-left">
        <div className="inline-flex items-center gap-2 bg-[var(--color-secondary-light)] text-[var(--color-secondary)] px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wide w-fit mx-auto md:mx-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
          Settings
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-[var(--color-text-main)] tracking-tight mt-2">
          Family Tastes
        </h1>
        <p className="font-sans text-xl text-[var(--color-text-muted)] font-medium max-w-xl mx-auto md:mx-0">
          Tell us what the family likes (and dislikes). We'll make sure the recipe recommendations reflect your kitchen's rules.
        </p>
      </div>

      {!isAdmin && household && (
        <div className="bg-[var(--color-secondary-light)] text-[var(--color-secondary)] p-4 rounded-2xl flex items-start gap-4 border border-[var(--color-secondary-light)]">
          <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div className="flex flex-col gap-1">
            <span className="font-display font-bold text-sm uppercase tracking-wide">Family Member Notice</span>
            <p className="font-sans text-sm font-medium opacity-90">Only the kitchen admin can change global dietary preferences. You can view the current settings below, but you won't be able to save changes.</p>
          </div>
        </div>
      )}

      {!household ? (
        <div className="soft-card p-8 bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold text-center border-none">
          No family profile detected. Please complete setup.
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          
          {/* Dietary Choices */}
          <section className="soft-card p-6 md:p-8 flex flex-col gap-6">
            <h2 className="text-2xl font-display font-bold text-[var(--color-text-main)] flex items-center gap-2 border-b border-slate-100 pb-4">
              Dietary choices
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <button
                onClick={() => isAdmin && handleLocalUpdate({ is_vegetarian: !localPrefs.is_vegetarian })}
                disabled={!isAdmin}
                className={`p-6 rounded-2xl text-left transition-all duration-300 border-2 ${
                  localPrefs.is_vegetarian 
                    ? "bg-[var(--color-success-light)] border-[var(--color-success)] shadow-md" 
                    : "bg-slate-50 border-transparent hover:border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`font-display font-bold text-lg ${localPrefs.is_vegetarian ? "text-[var(--color-success)]" : "text-[var(--color-text-main)]"}`}>Vegetarian</span>
                  <div className={`w-5 h-5 rounded-full mt-1 flex items-center justify-center transition-colors ${localPrefs.is_vegetarian ? "bg-[var(--color-success)] text-white" : "bg-slate-200"}`}>
                    {localPrefs.is_vegetarian && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>}
                  </div>
                </div>
                <span className={`font-sans text-sm font-medium ${localPrefs.is_vegetarian ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]"}`}>
                  Excludes poultry, meat, and seafood from your menu.
                </span>
              </button>

              <button
                onClick={() => isAdmin && handleLocalUpdate({ vegan: !localPrefs.vegan })}
                disabled={!isAdmin}
                className={`p-6 rounded-2xl text-left transition-all duration-300 border-2 ${
                  localPrefs.vegan 
                    ? "bg-[var(--color-success-light)] border-[var(--color-success)] shadow-md" 
                    : "bg-slate-50 border-transparent hover:border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`font-display font-bold text-lg ${localPrefs.vegan ? "text-[var(--color-success)]" : "text-[var(--color-text-main)]"}`}>Plant-Based</span>
                  <div className={`w-5 h-5 rounded-full mt-1 flex items-center justify-center transition-colors ${localPrefs.vegan ? "bg-[var(--color-success)] text-white" : "bg-slate-200"}`}>
                    {localPrefs.vegan && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>}
                  </div>
                </div>
                <span className={`font-sans text-sm font-medium ${localPrefs.vegan ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]"}`}>
                  A strict plant-based diet without animal byproducts.
                </span>
              </button>

            </div>
          </section>

          {/* Flavor Profiles */}
          <section className="soft-card p-6 md:p-8 flex flex-col gap-6">
            <h2 className="text-2xl font-display font-bold text-[var(--color-text-main)] flex items-center gap-2 border-b border-slate-100 pb-4">
              Flavor profile
            </h2>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-display font-bold text-lg text-[var(--color-text-main)]">Spice Tolerance</span>
                  <span className="font-sans text-sm font-medium text-[var(--color-text-muted)]">How much heat does the family prefer?</span>
                </div>
                <span className="font-sans bg-white px-3 py-1 rounded-lg text-[var(--color-primary)] font-bold uppercase tracking-wider text-sm shadow-sm">
                  {localPrefs.spice_level || "Medium"}
                </span>
              </div>
              
              <div className="pt-4 pb-2 px-2">
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="1"
                  value={localPrefs.spice_level === "low" ? 0 : localPrefs.spice_level === "high" ? 2 : 1}
                  onChange={(e) => {
                    if (!isAdmin) return;
                    const levels = ["low", "medium", "high"];
                    handleLocalUpdate({ spice_level: levels[parseInt(e.target.value)] });
                  }}
                  disabled={!isAdmin}
                  className={`w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-not-allowed accent-[var(--color-primary)] ${isAdmin ? "cursor-pointer" : "opacity-50"}`}
                />
                <div className="flex justify-between text-xs font-bold text-slate-400 mt-3 uppercase tracking-wider">
                  <span>Mild</span>
                  <span>Medium</span>
                  <span>Spicy</span>
                </div>
              </div>
            </div>
          </section>

          {/* Household Management */}
          <section className="soft-card p-6 md:p-8 flex flex-col gap-8 bg-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent-light)] opacity-20 rounded-bl-full -mr-10 -mt-10"></div>
            
            <div className="flex flex-col gap-2 relative z-10">
              <h2 className="text-2xl font-display font-bold text-[var(--color-text-main)]">Household Management</h2>
              <p className="font-sans text-sm text-[var(--color-text-muted)] font-medium">Invite family members or join an existing household.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              
              {/* Share Code */}
              <div className="flex flex-col gap-4">
                <label className="font-display font-bold text-sm text-text-main opacity-80 uppercase tracking-wide">Your Invite Code</label>
                <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center gap-3">
                  <span className="font-display font-black text-4xl tracking-widest text-[var(--color-primary)]">
                    {household.invite_code || "------"}
                  </span>
                  <p className="font-sans text-xs font-semibold text-[var(--color-text-muted)] text-center">
                    Share this code with your family members to have them join your kitchen.
                  </p>
                </div>
              </div>

              {/* Join Household */}
              <form onSubmit={handleJoin} className="flex flex-col gap-4">
                <label className="font-display font-bold text-sm text-text-main opacity-80 uppercase tracking-wide">Join Another Household</label>
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="ENTER CODE"
                    value={inviteCodeInput}
                    onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                    className="input-soft text-center font-display font-black tracking-widest text-2xl"
                  />
                  <button 
                    type="submit"
                    disabled={joining || !inviteCodeInput}
                    className={`btn-secondary py-3 text-sm font-bold w-full ${joining ? "opacity-50" : ""}`}
                  >
                    {joining ? "Joining..." : "Join Household"}
                  </button>
                  {joinStatus && (
                    <p className={`text-xs font-bold text-center ${joinStatus.includes("Successfully") ? "text-[var(--color-success)]" : "text-[var(--color-primary)]"}`}>
                      {joinStatus}
                    </p>
                  )}
                </div>
              </form>

            </div>

            {/* Members List */}
            <div className="border-t border-slate-100 pt-6 flex flex-col gap-4 relative z-10">
              <label className="font-display font-bold text-sm text-text-main opacity-80 uppercase tracking-wide">Kitchen Members ({members.length})</label>
              <div className="flex flex-wrap gap-3">
                {members.map(member => (
                  <div key={member.id} className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 group">
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-[var(--color-text-main)] group-hover:bg-[var(--color-secondary-light)] transition-colors">
                      {member.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-sans text-sm font-bold text-[var(--color-text-main)]">{member.email}</span>
                    {member.id === household.admin_id && (
                      <span className="bg-[var(--color-accent-light)] text-[var(--color-accent)] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter">Admin</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Save Action */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 gap-4">
            <span className={`font-sans text-sm font-bold px-4 py-2 rounded-lg ${
              status.includes("Saved") ? "bg-[var(--color-success-light)] text-[var(--color-success)]" :
              status.includes("Fail") ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]" :
              isDirty ? "bg-[var(--color-accent-light)] text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"
            }`}>
              {status || (isDirty ? "● Unsaved changes" : "All up to date ✨")}
            </span>
            
            <button
              onClick={handleSeal}
              disabled={!isDirty || saving || !isAdmin}
              className={`btn-primary w-full sm:w-auto ${(!isDirty && !saving && isAdmin) ? "opacity-50 grayscale cursor-not-allowed" : (!isAdmin ? "hidden" : "")}`}
            >
              {saving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
