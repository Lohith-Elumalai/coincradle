import { useContext, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ThemeContext } from '../contexts/ThemeContext';
import { ProtectedRoute } from '../components/guards/ProtectedRoute';
import { Button, Toggle, Modal, Input } from '../components/common';

const Settings = () => {
  const { user, updateProfile, logout, deleteAccount } = useAuth();
  const { theme, setTheme } = useContext(ThemeContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ProtectedRoute>
      <div className="p-4 max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Settings</h1>

        {/* Profile Settings */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Button type="submit">Update Profile</Button>
          </form>
        </section>

        {/* Appearance Settings */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Theme</span>
              <select
                value={theme}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="bg-gray-50 border border-gray-300 rounded-md p-2 dark:bg-gray-700"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notification Settings */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="flex items-center justify-between">
            <span>Email Notifications</span>
            <Toggle
              enabled={notificationsEnabled}
              onChange={setNotificationsEnabled}
            />
          </div>
        </section>

        {/* Account Management */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <div className="space-y-4">
            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              Delete Account
            </Button>
            <Button onClick={logout} variant="secondary">
              Logout
            </Button>
          </div>
        </section>

        {/* Delete Account Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Confirm Account Deletion"
        >
          <div className="space-y-4">
            <p>Are you sure you want to permanently delete your account? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={deleteAccount}>
                Delete Account
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
};

export default Settings;