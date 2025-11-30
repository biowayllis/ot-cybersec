import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterValues {
  type: string;
  location: string;
  zone: string;
  owner: string;
  criticality: string;
}

interface AssetFiltersProps {
  filters: FilterValues;
  onFilterChange: (key: keyof FilterValues, value: string) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export const AssetFilters = ({ filters, onFilterChange, onClearFilters, activeFilterCount }: AssetFiltersProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Filters</h3>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-8">
              <X className="h-4 w-4 mr-1" />
              Clear ({activeFilterCount})
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Asset Type</label>
            <Select value={filters.type} onValueChange={(value) => onFilterChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="it">IT Assets</SelectItem>
                <SelectItem value="ot">OT Assets</SelectItem>
                <SelectItem value="critical">Critical Infrastructure</SelectItem>
                <SelectItem value="cloud">Cloud Resources</SelectItem>
                <SelectItem value="hardware">Hardware</SelectItem>
                <SelectItem value="software">Software</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Location</label>
            <Select value={filters.location} onValueChange={(value) => onFilterChange('location', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="datacenter-1">Datacenter 1</SelectItem>
                <SelectItem value="datacenter-2">Datacenter 2</SelectItem>
                <SelectItem value="plant-floor">Plant Floor</SelectItem>
                <SelectItem value="control-room">Control Room</SelectItem>
                <SelectItem value="remote">Remote Sites</SelectItem>
                <SelectItem value="cloud">Cloud</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Zone</label>
            <Select value={filters.zone} onValueChange={(value) => onFilterChange('zone', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Zones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
                <SelectItem value="dmz">DMZ</SelectItem>
                <SelectItem value="scada">SCADA</SelectItem>
                <SelectItem value="control">Control Systems</SelectItem>
                <SelectItem value="process">Process Control</SelectItem>
                <SelectItem value="safety">Safety Systems</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Owner</label>
            <Select value={filters.owner} onValueChange={(value) => onFilterChange('owner', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Owners" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Owners</SelectItem>
                <SelectItem value="it-ops">IT Operations</SelectItem>
                <SelectItem value="ot-ops">OT Operations</SelectItem>
                <SelectItem value="security">Security Team</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Criticality</label>
            <Select value={filters.criticality} onValueChange={(value) => onFilterChange('criticality', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};