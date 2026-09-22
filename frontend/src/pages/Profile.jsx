
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    try {
      const profile = JSON.parse(
        localStorage.getItem(`jp_profile_${user.id}`) || "{}"
      );

      setAge(profile.age || "");
      setGender(profile.gender || "");
    } catch {
      setAge("");
      setGender("");
    }
  }, [user]);

  const handleSave = () => {
    if (!user?.id) return;

    localStorage.setItem(
      `jp_profile_${user.id}`,
      JSON.stringify({ age, gender })
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      {/* Back button */}
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate/70 transition hover:bg-maroon/5 hover:text-maroon"
      >
        <span aria-hidden="true">←</span>
        Back to Journey
      </Link>

      <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
        <h1 className="font-display text-3xl text-slate">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-slate/60">
          Manage your personal details.
        </p>

        <div className="mt-8 space-y-6">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <input
              type="text"
              value={user?.full_name || ""}
              disabled
              className="w-full rounded-lg border border-black/10 bg-gray-100 px-4 py-3 text-slate/70"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full rounded-lg border border-black/10 bg-gray-100 px-4 py-3 text-slate/70"
            />
          </div>

          {/* Age */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Age
            </label>

            <input
              type="number"
              min="1"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              className="w-full rounded-lg border border-black/10 bg-white px-4 py-3 outline-none focus:border-maroon"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Gender
            </label>

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-lg border border-black/10 bg-white px-4 py-3 outline-none focus:border-maroon"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">
                Prefer not to say
              </option>
            </select>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            className="rounded-lg bg-maroon px-6 py-3 font-medium text-white hover:bg-maroon-dark"
          >
            Save Profile
          </button>

          {saved && (
            <p className="text-sm text-green-600">
              Profile saved successfully.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}