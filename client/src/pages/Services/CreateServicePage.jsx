import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { servicesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUpload, FiX, FiMapPin } from 'react-icons/fi';

const categories = ['Graphic Design', 'Web Development', 'Photography', 'Home Services', 'Tutoring', 'Content Writing', 'Digital Marketing', 'Video Editing', 'Other'];
const locations = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Abbottabad', 'Bahawalpur', 'Sargodha', 'Mardan', 'Swat', 'Gilgit', 'Skardu'];

const CreateServicePage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [portfolioPreviews, setPortfolioPreviews] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', price: '', priceType: 'fixed', category: '',
    serviceType: 'in_person', deliveryTime: '', locationName: '',
  });
  useEffect(() => {
    if (isEdit) {
      const fetchService = async () => {
        try {
          const { data } = await servicesAPI.getOne(id);
          const s = data.service || data.data || data;
          setForm({ title: s.title, description: s.description, price: s.price, priceType: s.priceType || 'fixed', category: s.category, serviceType: s.serviceType || 'in_person', deliveryTime: s.deliveryTime || '', locationName: s.locationName || '' });
          setPortfolioPreviews(s.portfolioImages || s.images || []);
        } catch { toast.error('Service not found'); navigate('/services'); }
      };
      fetchService();
    }
  }, [id]);

  const handleImageChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === 'portfolio') {
      setPortfolioImages(files);
      setPortfolioPreviews(files.map((f) => URL.createObjectURL(f)));
    } else {
      setImages(files);
      setImagePreviews(files.map((f) => URL.createObjectURL(f)));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => { if (value) formData.append(key, value); });
      images.forEach((img) => formData.append('images', img));
      portfolioImages.forEach((img) => formData.append('portfolioImages', img));

      if (isEdit) {
        await servicesAPI.update(id, formData);
        toast.success('Service updated!');
      } else {
        await servicesAPI.create(formData);
        toast.success('Service created! Pending approval.');
      }
      navigate('/my-listings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-charcoal mb-8">{isEdit ? 'Edit Service' : 'Offer a Service'}</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Portfolio Images</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {portfolioPreviews.map((src, i) => (
              <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setPortfolioPreviews((p) => p.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 border-none cursor-pointer"><FiX size={12} /></button>
              </div>
            ))}
            {portfolioPreviews.length < 5 && (
              <label className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                <FiUpload size={20} className="text-charcoal-light" /><span className="text-xs text-charcoal-light mt-1">Add</span>
                <input type="file" accept="image/*" multiple onChange={(e) => handleImageChange(e, 'portfolio')} className="hidden" />
              </label>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Title</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={100} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="What service do you offer?" />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required maxLength={2000} rows={5} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none" placeholder="Describe your service..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Price ($)</label>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="0" step="0.01" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Price Type</label>
            <select value={form.priceType} onChange={(e) => setForm({ ...form, priceType: e.target.value })} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary bg-white">
              <option value="fixed">Fixed Price</option>
              <option value="hourly">Per Hour</option>
              <option value="starting_at">Starting At</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary bg-white">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Service Type</label>
            <select value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary bg-white">
              <option value="in_person">In-Person (requires delivery)</option>
              <option value="online">Online / Digital (no delivery)</option>
            </select>
          </div>
        </div>

        {form.serviceType === 'in_person' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Delivery Time</label>
            <input type="text" value={form.deliveryTime} onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="e.g. 3-5 days" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Location</label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" size={16} />
              <select value={form.locationName} onChange={(e) => setForm({ ...form, locationName: e.target.value })} className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary bg-white">
                <option value="">Select location</option>
                {locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
          </div>
        </div>
        )}

        {form.serviceType === 'online' && (
          <div className="bg-neutral/50 rounded-lg p-4 text-sm text-charcoal-light">
            This service is online/digital — no delivery address or physical location needed.
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full bg-accent text-primary py-3 rounded-xl font-semibold text-sm hover:bg-accent-dark disabled:opacity-50 border-none cursor-pointer transition-colors">
          {loading ? 'Saving...' : isEdit ? 'Update Service' : 'Create Service'}
        </button>
      </form>
    </div>
  );
};

export default CreateServicePage;
