import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface LoginLocation {
  id: string;
  event_type: string;
  latitude: number;
  longitude: number;
  city: string | null;
  country: string | null;
  country_code: string | null;
  is_high_risk: boolean;
  ip_address: string | null;
  created_at: string;
}

export const LoginLocationsMap = () => {
  const { user } = useAuth();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  // Fetch Mapbox token from environment
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (error) throw error;
        if (data?.token) {
          setMapboxToken(data.token);
        }
      } catch (error) {
        console.error("Error fetching Mapbox token:", error);
      }
    };
    fetchToken();
  }, []);

  const { data: locations, isLoading } = useQuery({
    queryKey: ['login-locations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .eq('user_id', user.id)
        .in('event_type', ['login', 'login_failed'])
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as LoginLocation[];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || !locations?.length) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [0, 20],
        zoom: 1.5,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );
    }

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for each location
    locations.forEach((location) => {
      const el = document.createElement('div');
      el.className = 'login-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.border = '2px solid white';
      
      if (location.is_high_risk) {
        el.style.backgroundColor = '#dc2626';
        el.style.boxShadow = '0 0 10px rgba(220, 38, 38, 0.8)';
      } else if (location.event_type === 'login_failed') {
        el.style.backgroundColor = '#f59e0b';
        el.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.6)';
      } else {
        el.style.backgroundColor = '#10b981';
        el.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.6)';
      }

      const popupContent = `
        <div style="padding: 8px; min-width: 200px;">
          <div style="font-weight: bold; margin-bottom: 8px; color: #1a1a1a;">
            ${location.event_type === 'login' ? '✓ Successful Login' : '✗ Failed Login'}
            ${location.is_high_risk ? ' ⚠️' : ''}
          </div>
          ${location.city || location.country ? 
            `<div style="margin-bottom: 4px; color: #404040;">
              📍 ${[location.city, location.country].filter(Boolean).join(', ')}
            </div>` 
            : ''}
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
            🕐 ${format(new Date(location.created_at), 'PPpp')}
          </div>
          <div style="font-size: 12px; color: #6b7280; font-family: monospace;">
            🌐 ${location.ip_address || 'Unknown IP'}
          </div>
          ${location.is_high_risk ? 
            '<div style="margin-top: 8px; padding: 4px; background: #fef2f2; border-left: 3px solid #dc2626; font-size: 11px; color: #991b1b;">High-risk region detected</div>' 
            : ''}
        </div>
      `;

      const popup = new mapboxgl.Popup({ 
        offset: 25,
        maxWidth: '300px',
      }).setHTML(popupContent);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.longitude, location.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      markers.current.push(marker);
    });

    // Fit map to show all markers
    if (locations.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      locations.forEach((location) => {
        bounds.extend([location.longitude, location.latitude]);
      });
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 10 });
    }

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
    };
  }, [locations, mapboxToken]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Login Locations Map
          </CardTitle>
          <CardDescription>Geographic visualization of your login activity</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const highRiskCount = locations?.filter(l => l.is_high_risk).length || 0;
  const failedCount = locations?.filter(l => l.event_type === 'login_failed').length || 0;
  const uniqueCountries = new Set(locations?.map(l => l.country).filter(Boolean)).size;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Login Locations Map
        </CardTitle>
        <CardDescription>
          Geographic visualization of your login activity (last 50 events with location data)
        </CardDescription>
        <div className="flex gap-2 mt-2 flex-wrap">
          <Badge variant="secondary">
            {uniqueCountries} {uniqueCountries === 1 ? 'Country' : 'Countries'}
          </Badge>
          {highRiskCount > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {highRiskCount} High-Risk
            </Badge>
          )}
          {failedCount > 0 && (
            <Badge variant="outline" className="border-yellow-500 text-yellow-600">
              {failedCount} Failed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!mapboxToken ? (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>Map not available - Mapbox token not configured</p>
          </div>
        ) : !locations?.length ? (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No location data available yet</p>
            <p className="text-xs mt-2">Location data will appear here after your next login</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div ref={mapContainer} className="h-[500px] rounded-lg border" />
            <div className="flex gap-4 text-xs text-muted-foreground justify-center flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 border border-white"></div>
                <span>Successful Login</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500 border border-white"></div>
                <span>Failed Login</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600 border border-white"></div>
                <span>High-Risk Region</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};