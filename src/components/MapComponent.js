import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Leaflet map only works on web — use placeholder on mobile
let MapContainer, TileLayer, Marker, Popup, useMap;
if (Platform.OS === 'web') {
    try {
        const RL = require('react-leaflet');
        MapContainer = RL.MapContainer;
        TileLayer = RL.TileLayer;
        Marker = RL.Marker;
        Popup = RL.Popup;
        useMap = RL.useMap;

        // Inject Leaflet CSS into the document head
        if (typeof document !== 'undefined' && !document.getElementById('leaflet-css')) {
            const link = document.createElement('link');
            link.id = 'leaflet-css';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);

            // Fix default marker icons (Leaflet + webpack issue)
            const L = require('leaflet');
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });
        }
    } catch (e) {
        console.warn('react-leaflet not available:', e);
    }
}

// Component to recenter map when center prop changes
function RecenterMap({ center }) {
    const map = useMap();
    React.useEffect(() => {
        if (center && map) {
            map.setView(center, map.getZoom(), { animate: true });
        }
    }, [center, map]);
    return null;
}

export default function MapComponent({ center, zoom = 14, markers = [], style }) {
    // Only render real map on web
    if (Platform.OS === 'web' && MapContainer) {
        const mapCenter = center || [6.9000, 79.8588]; // Default: Colombo

        return (
            <View style={[styles.container, style]}>
                <MapContainer
                    center={mapCenter}
                    zoom={zoom}
                    style={{ width: '100%', height: '100%', borderRadius: 12 }}
                    scrollWheelZoom={true}
                    zoomControl={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <RecenterMap center={mapCenter} />
                    {markers.filter(m => m.position && m.position[0] && m.position[1]).map((marker, index) => (
                        <Marker key={index} position={marker.position}>
                            <Popup>
                                <div>
                                    <strong style={{ color: '#1A1A1A' }}>{marker.title || 'Location'}</strong>
                                    {marker.description && (
                                        <p style={{ margin: '4px 0 0', color: '#717171', fontSize: 12 }}>
                                            {marker.description}
                                        </p>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </View>
        );
    }

    // Mobile fallback placeholder
    return (
        <View style={[styles.container, style]}>
            <View style={styles.placeholder}>
                <Ionicons name="map" size={48} color="#EF475D" />
                <Text style={styles.text}>Interactive Map</Text>
                <Text style={styles.subText}>View on desktop to explore the university surroundings.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f1f5f9',
        minHeight: 400,
    },
    placeholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        textAlign: 'center',
    },
    subText: {
        marginTop: 5,
        fontSize: 14,
        color: '#717171',
        textAlign: 'center',
    },
});
