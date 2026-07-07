import Product from '../models/Product.js';
import Service from '../models/Service.js';

// @desc    Get nearby listings (products and/or services)
// @route   GET /api/listings/nearby
export const getNearbyListings = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const radius = parseFloat(req.query.radius) || 5000;
    const type = req.query.type || 'all';

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ success: false, message: 'lat and lng query parameters are required' });
    }

    const radiusInRadians = radius / 6378100;

    const geoFilter = {
      location: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radiusInRadians],
        },
      },
    };

    const listings = [];

    if (type === 'all' || type === 'product') {
      const products = await Product.find({ ...geoFilter, status: 'active' })
        .populate('user', 'name avatar locationName')
        .lean();
      listings.push(...products.map((p) => ({ ...p, listingType: 'product' })));
    }

    if (type === 'all' || type === 'service') {
      const services = await Service.find({ ...geoFilter, status: 'active' })
        .populate('user', 'name avatar locationName')
        .lean();
      listings.push(...services.map((s) => ({ ...s, listingType: 'service' })));
    }

    listings.sort((a, b) => {
      const distA = getDistance(lat, lng, a.location?.coordinates?.[1], a.location?.coordinates?.[0]);
      const distB = getDistance(lat, lng, b.location?.coordinates?.[1], b.location?.coordinates?.[0]);
      return distA - distB;
    });

    res.status(200).json({ success: true, count: listings.length, listings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

function getDistance(lat1, lng1, lat2, lng2) {
  if (lat2 == null || lng2 == null) return Infinity;
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
