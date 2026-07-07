import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import '../../utils/leafletIconFix';
import { nearbyAPI } from '../../services/api';
import Loader from '../../components/common/Loader';
import { FiMapPin, FiPackage, FiTool, FiAlertCircle, FiCrosshair } from 'react-icons/fi';

const PRODUCT_MARKER_COLOR = '#1B4A54';
const SERVICE_MARKER_COLOR = '#8CD211';
const DEFAULT_CENTER = [33.6844, 73.0479];
const DEFAULT_CENTER_NAME = 'Islamabad';
const RADIUS_OPTIONS = [
  { value: 1000, label: '1 km' },
  { value: 5000, label: '5 km' },
  { value: 10000, label: '10 km' },
  { value: 25000, label: '25 km' },
];

function createIcon(color) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 28px; height: 28px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 6px rgba(0,0,0,0.35);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  });
}

const productIcon = createIcon(PRODUCT_MARKER_COLOR);
const serviceIcon = createIcon(SERVICE_MARKER_COLOR);

const userIcon = L.divIcon({
  className: 'user-location-marker',
  html: '<div style="width:16px;height:16px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(59,130,246,0.3),0 2px 6px rgba(0,0,0,0.3);"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function LocationMarker({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, map.getZoom());
  }, [position, map]);
  return null;
}

function MapEvents({ onMoveEnd }) {
  useMapEvents({ moveend: (e) => { onMoveEnd(e.target); } });
  return null;
}

const NearbyMapPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [position, setPosition] = useState(null);
  const [radius, setRadius] = useState(5000);
  const [locationError, setLocationError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const mapRef = useRef(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      () => {
        setPosition(DEFAULT_CENTER);
        setLocationError(`Location access denied. Showing ${DEFAULT_CENTER_NAME}.`);
      }
    );
  }, []);

  useEffect(() => {
    if (position) fetchItems();
  }, [position, radius, activeTab]);

  const fetchItems = useCallback(async () => {
    if (!position) return;
    setLoading(true);
    try {
      const res = await nearbyAPI.getNearby({
        lat: position[0],
        lng: position[1],
        radius,
        type: activeTab,
      });
      setItems(res.data.listings || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [position, radius, activeTab]);

  const handleMoveEnd = useCallback((map) => {
    const center = map.getCenter();
    setPosition([center.lat, center.lng]);
  }, []);

  const requestLocation = () => {
    setLocationError('');
    navigator.geolocation?.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      () => {
        setPosition(DEFAULT_CENTER);
        setLocationError('Location access denied. Please enable it in your browser settings.');
      }
    );
  };

  const getMarkerIcon = (listing) =>
    listing.listingType === 'service' ? serviceIcon : productIcon;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-charcoal font-heading">Nearby Explorer</h1>
          <p className="text-charcoal-light mt-1">Discover products and services around you</p>
        </div>
        <button
          onClick={requestLocation}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-light border-none cursor-pointer transition-colors"
        >
          <FiCrosshair size={16} />
          Use My Location
        </button>
      </div>

      {locationError && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-sm text-charcoal">
          <FiAlertCircle className="text-amber-500 flex-shrink-0" size={18} />
          {locationError}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex gap-1 bg-neutral rounded-xl p-1 w-fit">
          {['all', 'product', 'service'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border-none cursor-pointer capitalize ${
                activeTab === tab ? 'bg-white text-primary shadow-sm' : 'bg-transparent text-charcoal-light'
              }`}
            >
              {tab === 'all' ? 'All' : tab === 'product' ? 'Products' : 'Services'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-charcoal-light">Radius:</span>
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="px-3 py-2 border border-border rounded-lg text-sm text-charcoal focus:outline-none focus:border-primary bg-white"
          >
            {RADIUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <span className="text-xs text-charcoal-light ml-2">
            {items.length} item{items.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      <div className="flex gap-6" style={{ height: 'calc(100vh - 300px)', minHeight: '500px' }}>
        <div className="flex-1 rounded-xl border border-border overflow-hidden relative">
          {position ? (
            <MapContainer
              center={position}
              zoom={13}
              className="h-full w-full z-0"
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker position={position} />
              <MapEvents onMoveEnd={handleMoveEnd} />

              <Marker position={position} icon={userIcon}>
                <Popup>You are here</Popup>
              </Marker>

              {items.map((item) => {
                const coords = item.location?.coordinates;
                if (!coords || coords.length < 2) return null;
                return (
                  <Marker
                    key={`${item.listingType}-${item._id}`}
                    position={[coords[1], coords[0]]}
                    icon={getMarkerIcon(item)}
                    eventHandlers={{ click: () => setSelectedItem(item) }}
                  >
                    <Popup>
                      <div className="p-1 min-w-[200px]">
                        <div className="flex gap-2 mb-2">
                          {item.images?.[0] ? (
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-neutral flex items-center justify-center text-charcoal-light flex-shrink-0">
                              {item.listingType === 'product' ? <FiPackage size={20} /> : <FiTool size={20} />}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-charcoal truncate">{item.title}</h4>
                            <p className="text-accent font-bold text-sm">${item.price}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              {item.ratings > 0 && (
                                <span className="text-xs text-charcoal-light">
                                  {'★'.repeat(Math.round(item.ratings))} ({item.numReviews})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            item.listingType === 'product'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-accent/20 text-primary'
                          }`}>
                            {item.listingType === 'product' ? 'Product' : 'Service'}
                          </span>
                          <Link
                            to={`/${item.listingType === 'product' ? 'products' : 'services'}/${item._id}`}
                            className="text-xs text-accent font-semibold hover:underline no-underline"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          ) : (
            <div className="h-full w-full bg-neutral flex items-center justify-center">
              <Loader text="Detecting location..." />
            </div>
          )}
        </div>

        <div className="w-80 overflow-y-auto space-y-3 hidden md:block">
          {loading ? (
            <Loader size="sm" text="Loading nearby..." />
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-charcoal-light text-sm">
              No items found within {(radius / 1000).toFixed(0)} km
            </div>
          ) : (
            items.map((item) => (
              <Link
                key={`${item.listingType}-${item._id}`}
                to={`/${item.listingType === 'product' ? 'products' : 'services'}/${item._id}`}
                className={`block bg-white rounded-xl border p-3 hover:shadow-md transition-shadow no-underline ${
                  selectedItem?._id === item._id && selectedItem?.listingType === item.listingType
                    ? 'border-primary'
                    : 'border-border'
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex gap-3">
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-neutral flex items-center justify-center text-charcoal-light flex-shrink-0">
                      {item.listingType === 'product' ? <FiPackage size={18} /> : <FiTool size={18} />}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm text-charcoal truncate">{item.title}</h4>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${
                        item.listingType === 'product'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-accent/20 text-primary'
                      }`}>
                        {item.listingType === 'product' ? 'Product' : 'Service'}
                      </span>
                    </div>
                    <p className="text-accent font-semibold text-sm">${item.price}</p>
                    <p className="text-xs text-charcoal-light truncate">{item.locationName || 'Location set'}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NearbyMapPage;
