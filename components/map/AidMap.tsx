'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, ShieldCheck, DollarSign, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with Next.js/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Relief Zones Data (India Specific)
const RELIEF_ZONES = [
    {
        id: 1,
        title: "Odisha Cyclone Response",
        latitude: 20.9517,
        longitude: 85.0985,
        severity: "Critical",
        impact: "$1.2M allocated",
        beneficiaries: "45,000",
        type: "Cyclone"
    },
    {
        id: 2,
        title: "Himachal Flood Relief",
        latitude: 31.9272,
        longitude: 77.2515, // Himachal Pradesh
        severity: "High",
        impact: "$800k allocated",
        beneficiaries: "12,200",
        type: "Flood"
    },
    {
        id: 3,
        title: "Wayanad Landslide Recovery",
        latitude: 11.6854,
        longitude: 76.1320, // Kerala
        severity: "Medium",
        impact: "$450k allocated",
        beneficiaries: "5,500",
        type: "Landslide"
    }
];

const createCustomIcon = (severity: string) => {
    let colorClass = 'bg-blue-500';
    if (severity === 'Critical') colorClass = 'bg-red-500';
    if (severity === 'High') colorClass = 'bg-orange-500';

    // We use a divIcon to render a custom tailwind styled marker
    return L.divIcon({
        className: 'custom-marker',
        html: `<div class="relative group cursor-pointer">
                 <div class="p-2 rounded-full shadow-lg ${colorClass} border-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white h-5 w-5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                 </div>
                 <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${colorClass}"></div>
               </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
};

export function AidMap() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="h-[500px] w-full bg-slate-900 animate-pulse flex items-center justify-center text-slate-500">
                Loading Map...
            </div>
        );
    }

    return (
        <Card className="overflow-hidden border-none shadow-2xl ring-1 ring-black/10 h-[500px] w-full relative group">
            <CardHeader className="absolute top-0 left-0 z-[1000] w-full bg-gradient-to-b from-black/60 to-transparent pt-6 px-6 pb-12 pointer-events-none">
                <div className="flex justify-between items-start pointer-events-auto">
                    <div>
                        <CardTitle className="text-white flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-emerald-400" />
                            Live Impact Map
                        </CardTitle>
                        <CardDescription className="text-gray-200">
                            Real-time tracking of aid distribution zones across India.
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-black/40 text-white backdrop-blur-md border-white/20">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
                        Live Feed
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-0 h-full w-full bg-slate-900 relative z-0">
                <MapContainer
                    center={[22.5937, 78.9629]} // Center of India
                    zoom={5}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    <ZoomControl position="bottomright" />

                    {RELIEF_ZONES.map((zone) => (
                        <Marker
                            key={zone.id}
                            position={[zone.latitude, zone.longitude]}
                            icon={createCustomIcon(zone.severity)}
                        >
                            <Popup className="custom-popup">
                                <div className="min-w-[200px]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge className={`
                                            ${zone.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                                                zone.severity === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}
                                        `}>
                                            {zone.severity} Priority
                                        </Badge>
                                        <span className="text-xs text-muted-foreground font-mono">{zone.type}</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-1">{zone.title}</h3>
                                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                                        <div className="bg-gray-50 p-2 rounded">
                                            <p className="text-muted-foreground text-xs uppercase font-semibold flex items-center gap-1"><DollarSign className="h-3 w-3" /> Impact</p>
                                            <p className="font-bold text-gray-900">{zone.impact}</p>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded">
                                            <p className="text-muted-foreground text-xs uppercase font-semibold flex items-center gap-1"><Users className="h-3 w-3" /> People</p>
                                            <p className="font-bold text-gray-900">{zone.beneficiaries}</p>
                                        </div>
                                    </div>
                                    <button className="w-full mt-3 bg-primary text-primary-foreground text-sm font-medium py-2 rounded-md hover:opacity-90 transition-opacity">
                                        View Details
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </CardContent>
        </Card>
    );
}
