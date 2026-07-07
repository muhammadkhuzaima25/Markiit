import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiBell, FiGlobe, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import UserLayout from '../../components/layout/UserLayout';

const UserSettingsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    language: 'en',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // Placeholder for settings save logic
      toast.success('Settings saved!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-charcoal">Settings</h1>

        <div className="bg-white rounded-xl border border-border p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-charcoal mb-4 flex items-center gap-2">
              <FiBell size={16} /> Notification Preferences
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral cursor-pointer">
                <span className="text-sm text-charcoal">Email Notifications</span>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral cursor-pointer">
                <span className="text-sm text-charcoal">Push Notifications</span>
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-charcoal mb-4 flex items-center gap-2">
              <FiGlobe size={16} /> Language
            </h3>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>

          <div className="pt-4 border-t border-border">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-accent text-primary px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-accent-dark disabled:opacity-50 border-none cursor-pointer transition-colors flex items-center gap-2"
            >
              <FiSave size={14} />
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserSettingsPage;