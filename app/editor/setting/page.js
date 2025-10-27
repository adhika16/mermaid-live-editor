"use client";

import { useSettings } from "@/lib/useSettings";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";

const SettingPage = () => {
  const { settings, updateSetting, resetSettings, isLoading } = useSettings();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }
    
  }, [user, loading, router]);

  const handleThemeChange = (newTheme) => {
    updateSetting("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    showSaveSuccess();
  };

  const handleAutoRenderChange = (value) => {
    updateSetting("autoRender", value);
    showSaveSuccess();
  };

  const handleRenderDelayChange = (value) => {
    updateSetting("renderDelay", parseInt(value));
    showSaveSuccess();
  };

  const handleResetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      resetSettings();
      document.documentElement.setAttribute("data-theme", "silk");
      showSaveSuccess();
    }
  };

  const showSaveSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-gray-500">Customize your Mermaid editor experience</p>
        </div>

        {/* Settings Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-6 space-y-6">
            {/* Theme Setting */}
            <div className="form-control">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="card-title">Theme</h2>
                  <p className="text-sm text-base-content/70">Choose your preferred color theme</p>
                </div>
                <div className="badge badge-primary">UI</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: "silk", name: "Light", icon: "☀️" },
                  { value: "abyss", name: "Dark", icon: "🌙" },
                  { value: "cyberpunk", name: "Cyberpunk", icon: "⚡" },
                ].map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => handleThemeChange(theme.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      settings.theme === theme.value
                        ? "border-primary bg-primary bg-opacity-10"
                        : "border-base-300 hover:border-primary"
                    }`}
                  >
                    <div className="text-2xl mb-2">{theme.icon}</div>
                    <div className="font-semibold">{theme.name}</div>
                    <div className="text-xs text-base-content/70">{theme.value}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="divider"></div>

            {/* Auto-render Setting */}
            <div className="form-control">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="card-title">Auto-render Preview</h2>
                  <p className="text-sm text-base-content/70">
                    Automatically render diagram preview as you type
                  </p>
                </div>
                <div className="badge badge-info">PERFORMANCE</div>
              </div>

              <div className="space-y-2">
                <label className="label cursor-pointer p-4 border border-base-300 rounded-lg hover:bg-base-200 transition-colors">
                  <span className="label-text">
                    <div className="font-semibold">Enabled</div>
                    <div className="text-sm text-base-content/70">Real-time preview updates</div>
                  </span>
                  <input
                    type="radio"
                    name="autoRender"
                    checked={settings.autoRender === true}
                    onChange={() => handleAutoRenderChange(true)}
                    className="radio radio-primary"
                  />
                </label>

                <label className="label cursor-pointer p-4 border border-base-300 rounded-lg hover:bg-base-200 transition-colors">
                  <span className="label-text">
                    <div className="font-semibold">Disabled</div>
                    <div className="text-sm text-base-content/70">Better performance on slow devices</div>
                  </span>
                  <input
                    type="radio"
                    name="autoRender"
                    checked={settings.autoRender === false}
                    onChange={() => handleAutoRenderChange(false)}
                    className="radio radio-primary"
                  />
                </label>
              </div>
            </div>
            <div className="divider"></div>

            {/* Render Delay Setting */}
            {settings.autoRender && (
              <>
                <div className="form-control">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="card-title">Render Delay</h2>
                      <p className="text-sm text-base-content/70">
                        Time to wait before rendering (in milliseconds)
                      </p>
                    </div>
                    <div className="badge badge-secondary">ADVANCED</div>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="range"
                      min="100"
                      max="1000"
                      step="50"
                      value={settings.renderDelay}
                      onChange={(e) => handleRenderDelayChange(e.target.value)}
                      className="range range-primary w-full"
                    />
                    <div className="flex justify-between text-sm text-base-content/70">
                      <span>Fast (100ms)</span>
                      <span className="font-semibold text-primary">{settings.renderDelay}ms</span>
                      <span>Slow (1000ms)</span>
                    </div>
                    <div className="alert">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span>Lower values = faster updates but higher CPU usage. Increase if you experience lag.</span>
                    </div>
                  </div>
                </div>
                <div className="divider"></div>
              </>
            )}

            {/* Reset Button */}
            <div className="card-actions pt-6">
              <button
                onClick={handleResetSettings}
                className="btn btn-outline btn-error w-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div role="alert" className="alert mt-8">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div>
            <h3 className="font-bold">Settings saved automatically</h3>
            <div className="text-xs">Your preferences are saved locally in your browser. These settings will persist across sessions.</div>
          </div>
        </div>
      </div>

      {/* Save Success Toast */}
      {saveSuccess && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Settings saved!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingPage;
