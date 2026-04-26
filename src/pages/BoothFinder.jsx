/**
 * VoteWise India — Booth Finder Page
 * Google Maps integration to find nearby polling booths
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { INDIAN_STATES } from '../data/electionData';
import './BoothFinder.css';

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function BoothFinder() {
  const { t } = useAppContext();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searching, setSearching] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // Load Google Maps script
  useEffect(() => {
    if (window.google?.maps) {
      setMapLoaded(true);
      return;
    }

    if (!MAPS_API_KEY || MAPS_API_KEY === 'your_google_maps_api_key_here') {
      setErrorMsg(t(
        'Google Maps API key not configured. Add VITE_GOOGLE_MAPS_API_KEY in .env file.',
        'Google Maps API key कॉन्फ़िगर नहीं है। .env फ़ाइल में VITE_GOOGLE_MAPS_API_KEY जोड़ें।'
      ));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;

    window.initGoogleMaps = () => {
      setMapLoaded(true);
      delete window.initGoogleMaps;
    };

    script.onerror = () => {
      setErrorMsg(t(
        'Failed to load Google Maps. Please check your internet connection.',
        'Google Maps लोड नहीं हो पाया। कृपया इंटरनेट कनेक्शन जांचें।'
      ));
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialize map once loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;

    // Default center: India
    const india = { lat: 22.5937, lng: 78.9629 };
    
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: india,
      zoom: 5,
      styles: getMapStyles(),
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });
  }, [mapLoaded]);

  // Get user's current location
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setErrorMsg(t('Geolocation not supported by your browser', 'आपका ब्राउज़र जियोलोकेशन सपोर्ट नहीं करता'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(loc);
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter(loc);
          mapInstanceRef.current.setZoom(14);

          // User location marker
          new window.google.maps.Marker({
            position: loc,
            map: mapInstanceRef.current,
            title: t('Your Location', 'आपका स्थान'),
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#2563EB',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 3,
            },
          });

          // Search for nearby booths
          searchNearby(loc);
        }
      },
      (error) => {
        setErrorMsg(t(
          'Location access denied. Please enter your area name to search.',
          'लोकेशन एक्सेस अस्वीकृत। कृपया सर्च करने के लिए अपने क्षेत्र का नाम दर्ज करें।'
        ));
      }
    );
  }, [mapLoaded]);

  // Search for polling booths nearby
  const searchNearby = useCallback((location) => {
    if (!mapInstanceRef.current || !window.google?.maps?.places) return;

    setSearching(true);
    clearMarkers();

    const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);
    
    service.nearbySearch(
      {
        location: location,
        radius: 5000,
        keyword: 'polling booth voting station government school',
        type: 'school',
      },
      (results, status) => {
        setSearching(false);

        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const boothResults = results.slice(0, 8).map((place, i) => ({
            id: i,
            name: place.name,
            address: place.vicinity,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            rating: place.rating,
          }));

          setSearchResults(boothResults);

          // Add markers
          boothResults.forEach((booth, i) => {
            const marker = new window.google.maps.Marker({
              position: { lat: booth.lat, lng: booth.lng },
              map: mapInstanceRef.current,
              title: booth.name,
              label: {
                text: String(i + 1),
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: '700',
              },
              icon: {
                path: 'M12 0C7.31 0 3.5 3.81 3.5 8.5C3.5 14.88 12 24 12 24S20.5 14.88 20.5 8.5C20.5 3.81 16.69 0 12 0Z',
                fillColor: '#FF6B35',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
                scale: 1.5,
                anchor: new window.google.maps.Point(12, 24),
                labelOrigin: new window.google.maps.Point(12, 9),
              },
            });

            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding:8px;font-family:Inter,sans-serif">
                  <strong style="font-size:14px">${booth.name}</strong>
                  <p style="font-size:12px;color:#64748B;margin:4px 0 0">${booth.address || ''}</p>
                </div>
              `,
            });

            marker.addListener('click', () => {
              infoWindow.open(mapInstanceRef.current, marker);
            });

            markersRef.current.push(marker);
          });

          // Fit bounds to show all markers
          if (boothResults.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            boothResults.forEach(b => bounds.extend({ lat: b.lat, lng: b.lng }));
            if (location) bounds.extend(location);
            mapInstanceRef.current.fitBounds(bounds);
          }
        } else {
          setSearchResults([]);
        }
      }
    );
  }, []);

  // Text search for booths
  const handleSearch = useCallback(() => {
    if (!mapInstanceRef.current || !searchQuery.trim()) return;

    setSearching(true);
    clearMarkers();
    setErrorMsg('');

    const query = `polling booth voting station near ${searchQuery} ${selectedState}`.trim();

    const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);
    
    service.textSearch(
      { query: query },
      (results, status) => {
        setSearching(false);

        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const boothResults = results.slice(0, 8).map((place, i) => ({
            id: i,
            name: place.name,
            address: place.formatted_address,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          }));

          setSearchResults(boothResults);

          boothResults.forEach((booth, i) => {
            const marker = new window.google.maps.Marker({
              position: { lat: booth.lat, lng: booth.lng },
              map: mapInstanceRef.current,
              title: booth.name,
              label: {
                text: String(i + 1),
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: '700',
              },
              icon: {
                path: 'M12 0C7.31 0 3.5 3.81 3.5 8.5C3.5 14.88 12 24 12 24S20.5 14.88 20.5 8.5C20.5 3.81 16.69 0 12 0Z',
                fillColor: '#FF6B35',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
                scale: 1.5,
                anchor: new window.google.maps.Point(12, 24),
                labelOrigin: new window.google.maps.Point(12, 9),
              },
            });

            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding:8px;font-family:Inter,sans-serif">
                  <strong style="font-size:14px">${booth.name}</strong>
                  <p style="font-size:12px;color:#64748B;margin:4px 0 0">${booth.address || ''}</p>
                </div>
              `,
            });

            marker.addListener('click', () => {
              infoWindow.open(mapInstanceRef.current, marker);
            });

            markersRef.current.push(marker);
          });

          if (boothResults.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            boothResults.forEach(b => bounds.extend({ lat: b.lat, lng: b.lng }));
            mapInstanceRef.current.fitBounds(bounds);
          }
        } else {
          setSearchResults([]);
          setErrorMsg(t(
            'No polling booths found. Try a different location.',
            'कोई मतदान केंद्र नहीं मिला। कोई अलग लोकेशन ट्राई करें।'
          ));
        }
      }
    );
  }, [searchQuery, selectedState]);

  const clearMarkers = () => {
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const focusOnResult = (booth) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat: booth.lat, lng: booth.lng });
      mapInstanceRef.current.setZoom(16);
    }
  };

  const openInGoogleMaps = (booth) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${booth.lat},${booth.lng}`;
    window.open(url, '_blank', 'noopener');
  };

  return (
    <main className="booth-page" id="main-content">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-badge">{t('Google Maps', 'Google Maps')}</span>
          <h1 className="section-title">
            {t('Find Your', 'अपना')}{' '}
            <span className="gradient-text">{t('Polling Booth', 'मतदान केंद्र खोजें')}</span>
          </h1>
          <p className="section-subtitle">
            {t(
              'Search for polling booths and voting stations near you using Google Maps.',
              'Google Maps का उपयोग करके अपने पास के मतदान केंद्र खोजें।'
            )}
          </p>
        </div>

        <div className="booth-layout">
          {/* Search Panel */}
          <div className="booth-search">
            {/* Location button */}
            <button className="booth-locate-btn" onClick={getUserLocation} id="locate-me-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M2 12h4"/><path d="M18 12h4"/><circle cx="12" cy="12" r="3"/></svg>
              {t('Use My Location', 'मेरा लोकेशन इस्तेमाल करें')}
            </button>

            <div className="booth-divider">
              <span>{t('or search manually', 'या मैन्युअली सर्च करें')}</span>
            </div>

            {/* State dropdown */}
            <select
              className="booth-select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              aria-label="Select state"
              id="state-select"
            >
              <option value="">{t('Select State / UT', 'राज्य / केंद्र शासित चुनें')}</option>
              {INDIAN_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            {/* Search input */}
            <div className="booth-search-wrap">
              <input
                type="text"
                className="booth-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('Enter area, city or PIN code...', 'क्षेत्र, शहर या पिन कोड दर्ज करें...')}
                aria-label="Search location"
                id="booth-search-input"
              />
              <button
                className="booth-search-btn"
                onClick={handleSearch}
                disabled={searching || !searchQuery.trim()}
                id="booth-search-btn"
              >
                {searching ? (
                  <div className="loader" style={{ width: 18, height: 18, borderWidth: 2 }}></div>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                )}
              </button>
            </div>

            {/* Error message */}
            {errorMsg && (
              <div className="booth-error">
                <span>⚠️</span>
                <p>{errorMsg}</p>
              </div>
            )}

            {/* Results list */}
            {searchResults.length > 0 && (
              <div className="booth-results">
                <h3 className="booth-results__title">
                  {t(`${searchResults.length} Locations Found`, `${searchResults.length} स्थान मिले`)}
                </h3>
                <div className="booth-results__list">
                  {searchResults.map((booth) => (
                    <div key={booth.id} className="booth-result-card" onClick={() => focusOnResult(booth)}>
                      <div className="booth-result-card__number">{booth.id + 1}</div>
                      <div className="booth-result-card__info">
                        <h4>{booth.name}</h4>
                        <p>{booth.address}</p>
                      </div>
                      <button
                        className="booth-result-card__dir"
                        onClick={(e) => { e.stopPropagation(); openInGoogleMaps(booth); }}
                        aria-label={`Get directions to ${booth.name}`}
                        title={t('Open in Google Maps', 'Google Maps में खोलें')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="booth-tips">
              <h4>{t('💡 Tips', '💡 सुझाव')}</h4>
              <ul>
                <li>{t('Check your voter slip for your assigned polling booth', 'अपने मतदाता पर्ची पर अपना निर्धारित मतदान केंद्र देखें')}</li>
                <li>{t('Visit voters.eci.gov.in for official booth details', 'आधिकारिक बूथ विवरण के लिए voters.eci.gov.in पर जाएं')}</li>
                <li>{t('Carry a valid photo ID on election day', 'चुनाव के दिन एक वैध फोटो ID ले जाएं')}</li>
              </ul>
            </div>
          </div>

          {/* Map */}
          <div className="booth-map-container">
            {!mapLoaded && !errorMsg && (
              <div className="booth-map-loading">
                <div className="loader"></div>
                <p>{t('Loading Google Maps...', 'Google Maps लोड हो रहा है...')}</p>
              </div>
            )}
            <div ref={mapRef} className="booth-map" id="google-map"></div>
          </div>
        </div>
      </div>
    </main>
  );
}

/** Custom map styling for a clean look */
function getMapStyles() {
  return [
    { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.park', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ lightness: 20 }] },
    { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#d4e6f1' }] },
  ];
}
