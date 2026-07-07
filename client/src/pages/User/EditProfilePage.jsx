import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiUpload, FiMapPin } from 'react-icons/fi';

const EditProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [form, setForm] = useState({ name: '', bio: '', phone: '', locationName: '', skills: '' });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        bio: user.bio || '',
        phone: user.phone || '',
        locationName: user.locationName || '',
        skills: user.skills?.join(', ') || '',
      });
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('bio', form.bio);
      formData.append('phone', form.phone);
      formData.append('locationName', form.locationName);
      formData.append('skills', form.skills);
      if (avatarFile) formData.append('avatar', avatarFile);

      const { data } = await usersAPI.updateProfile(formData);
      updateUser(data.user || data.data);
      toast.success('Profile updated!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-charcoal mb-8">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-6 space-y-6">
        <div className="flex flex-col items-center gap-4">
          {avatarPreview ? <img src={avatarPreview} alt="" className="w-24 h-24 rounded-full object-cover" /> : <div className="w-24 h-24 rounded-full bg-neutral flex items-center justify-center text-charcoal-light"><FiUser size={40} /></div>}
          <label className="text-sm text-primary hover:underline cursor-pointer flex items-center gap-1">
            <FiUpload size={14} /> Change Photo
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Name</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Bio</label>
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none" placeholder="Tell people about yourself..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Phone</label>
          <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="Your phone number" />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Location</label>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" size={16} />
            <input type="text" value={form.locationName} onChange={(e) => setForm({ ...form, locationName: e.target.value })} className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="City, State" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Skills (comma separated)</label>
          <input type="text" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="e.g. Web Design, Photography, Tutoring" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-accent text-primary py-3 rounded-xl font-semibold text-sm hover:bg-accent-dark disabled:opacity-50 border-none cursor-pointer transition-colors">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
