import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUpload, FiX, FiMapPin } from 'react-icons/fi';

const categories = ['Electronics', 'Furniture', 'Clothing', 'Vehicles', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Other'];
const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
const locations = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Abbottabad', 'Bahawalpur', 'Sargodha', 'Mardan', 'Swat', 'Gilgit', 'Skardu'];

const CreateProductPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', price: '', category: '', condition: 'Good', locationName: '',
  });

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const { data } = await productsAPI.getOne(id);
          const p = data.product || data.data || data;
          setForm({ title: p.title, description: p.description, price: p.price, category: p.category, condition: p.condition || 'Good', locationName: p.locationName || '' });
          setPreviews(p.images || []);
        } catch { toast.error('Product not found'); navigate('/products'); }
      };
      fetchProduct();
    }
  }, [id]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => { if (value) formData.append(key, value); });
      images.forEach((img) => formData.append('images', img));

      if (isEdit) {
        await productsAPI.update(id, formData);
        toast.success('Product updated!');
      } else {
        await productsAPI.create(formData);
        toast.success('Product created! Pending approval.');
      }
      navigate('/my-listings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-charcoal mb-8">{isEdit ? 'Edit Product' : 'List a Product'}</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Product Images</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {previews.map((src, i) => (
              <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 border-none cursor-pointer">
                  <FiX size={12} />
                </button>
              </div>
            ))}
            {previews.length < 5 && (
              <label className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                <FiUpload size={20} className="text-charcoal-light" />
                <span className="text-xs text-charcoal-light mt-1">Add</span>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
          <p className="text-xs text-charcoal-light">Up to 5 images. First image is the cover.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Title</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={100} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="What are you selling?" />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required maxLength={2000} rows={5} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none" placeholder="Describe your product in detail..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Price ($)</label>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="0" step="0.01" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary bg-white">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Condition</label>
            <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary bg-white">
              {conditions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
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

        <button type="submit" disabled={loading} className="w-full bg-accent text-primary py-3 rounded-xl font-semibold text-sm hover:bg-accent-dark disabled:opacity-50 border-none cursor-pointer transition-colors">
          {loading ? 'Saving...' : isEdit ? 'Update Listing' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
};

export default CreateProductPage;
