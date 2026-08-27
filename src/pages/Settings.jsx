import { useState } from "react";
import {
  Bell,
  Check,
  ChevronDown,
  Globe2,
  KeyRound,
  LockKeyhole,
  Monitor,
  Palette,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Settings() {
  const { darkMode, toggleTheme } = useTheme();
  const [saved, setSaved] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSave = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="settings-page min-h-screen bg-slate-50 p-5 text-slate-900 dark:bg-black dark:text-slate-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500">Workspace control</p>
            <h1 className="text-3xl font-black tracking-tight">Settings</h1>
            <p className="mt-2 text-sm text-slate-500">Manage your portal preferences and account security.</p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5"
          >
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "Changes saved" : "Save changes"}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <nav className="h-fit rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-[#09090b]">
            <SettingsNav icon={<UserRound />} label="Account" active />
            <SettingsNav icon={<Palette />} label="Appearance" />
            <SettingsNav icon={<Bell />} label="Notifications" />
            <SettingsNav icon={<ShieldCheck />} label="Security" />
          </nav>

          <div className="space-y-6">
            <SettingsCard icon={<UserRound />} title="Account preferences" subtitle="Keep your administrator details up to date.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Display name" value="HR Admin" />
                <Field label="Email address" value="hr@hrportal.com" type="email" />
                <Field label="Language" value="English (US)" select />
                <Field label="Time zone" value="(UTC+05:00) Karachi" select />
              </div>
            </SettingsCard>

            <SettingsCard icon={<Palette />} title="Appearance" subtitle="Personalize how the portal looks on your device.">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <SettingRow icon={<Monitor />} title="Theme" description="Choose the color mode for your workspace.">
                  <div className="flex rounded-xl border border-slate-200 p-1 dark:border-slate-700">
                    <ModeButton label="Light" active={!darkMode} onClick={() => darkMode && toggleTheme()} />
                    <ModeButton label="Dark" active={darkMode} onClick={() => !darkMode && toggleTheme()} />
                  </div>
                </SettingRow>
                <SettingRow icon={<Globe2 />} title="Compact layout" description="Fit more information on each screen.">
                  <Toggle checked={true} />
                </SettingRow>
              </div>
            </SettingsCard>

            <SettingsCard icon={<Bell />} title="Notifications" subtitle="Choose which updates arrive in your inbox.">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <SettingRow icon={<Bell />} title="Email alerts" description="Receive important account and workforce updates.">
                  <Toggle checked={emailAlerts} onChange={() => setEmailAlerts((value) => !value)} />
                </SettingRow>
                <SettingRow icon={<Check />} title="Weekly summary" description="Get a Monday overview of portal activity.">
                  <Toggle checked={weeklySummary} onChange={() => setWeeklySummary((value) => !value)} />
                </SettingRow>
              </div>
            </SettingsCard>

            <SettingsCard icon={<ShieldCheck />} title="Security" subtitle="Add another layer of protection to your account.">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <SettingRow icon={<KeyRound />} title="Two-factor authentication" description="Use an authenticator app when signing in.">
                  <Toggle checked={twoFactor} onChange={() => setTwoFactor((value) => !value)} />
                </SettingRow>
                <SettingRow icon={<LockKeyhole />} title="Password" description="Last changed 30 days ago.">
                  <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Change</button>
                </SettingRow>
              </div>
            </SettingsCard>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsNav({ icon, label, active }) {
  return (
    <button type="button" className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-bold transition ${active ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300" : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"}`}>
      <span className="h-4 w-4">{icon}</span>
      {label}
    </button>
  );
}

function SettingsCard({ icon, title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#09090b] sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">{icon}</div>
        <div>
          <h2 className="text-sm font-bold">{title}</h2>
          <p className="mt-1 text-[11px] text-slate-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({ label, value, type = "text", select }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold text-slate-500 dark:text-slate-400">{label}</span>
      <div className="relative">
        <input type={type} defaultValue={value} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200" />
        {select && <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />}
      </div>
    </label>
  );
}

function SettingRow({ icon, title, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">{icon}</span>
        <div className="min-w-0"><p className="text-xs font-bold">{title}</p><p className="mt-1 text-[10px] text-slate-400">{description}</p></div>
      </div>
      {children}
    </div>
  );
}

function ModeButton({ label, active, onClick }) {
  return <button type="button" onClick={onClick} className={`rounded-lg px-3 py-2 text-[10px] font-bold transition ${active ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:text-slate-400"}`}>{label}</button>;
}

function Toggle({ checked, onChange }) {
  return <button type="button" aria-pressed={checked} onClick={onChange} className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${checked ? "left-6" : "left-1"}`} /></button>;
}

export default Settings;