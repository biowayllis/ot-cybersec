import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpDown, Eye } from "lucide-react";

interface Asset {
  id: string;
  name: string;
  type: string;
  category: string;
  location: string;
  zone: string;
  owner: string;
  criticality: string;
  vulnScore: number;
  patchLevel: number;
  compliance: string[];
  ip?: string;
  os?: string;
  lastSeen?: string;
  manufacturer?: string;
  model?: string;
}

interface AssetTableProps {
  assets: Asset[];
  onViewDetails: (asset: Asset) => void;
}

type SortField = 'name' | 'vulnScore' | 'patchLevel' | 'criticality';
type SortDirection = 'asc' | 'desc';

export const AssetTable = ({ assets, onViewDetails }: AssetTableProps) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAssets = [...assets].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    if (sortField === 'vulnScore' || sortField === 'patchLevel') {
      return (a[sortField] - b[sortField]) * direction;
    }
    
    if (sortField === 'criticality') {
      const order = ['critical', 'high', 'medium', 'low'];
      return (order.indexOf(a.criticality) - order.indexOf(b.criticality)) * direction;
    }
    
    return a.name.localeCompare(b.name) * direction;
  });

  const getCriticalityColor = (criticality: string) => {
    const colors: Record<string, string> = {
      critical: "bg-critical text-critical-foreground",
      high: "bg-high text-high-foreground",
      medium: "bg-medium text-medium-foreground",
      low: "bg-safe text-safe-foreground",
    };
    return colors[criticality] || "bg-muted text-muted-foreground";
  };

  const getVulnScoreColor = (score: number) => {
    if (score >= 8) return "text-critical font-bold";
    if (score >= 5) return "text-high font-semibold";
    if (score >= 3) return "text-medium";
    return "text-safe";
  };

  const getPatchLevelColor = (level: number) => {
    if (level >= 90) return "text-safe font-semibold";
    if (level >= 75) return "text-medium";
    return "text-high font-semibold";
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('name')} className="h-8 px-2">
                    Asset Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('criticality')} className="h-8 px-2">
                    Criticality
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('vulnScore')} className="h-8 px-2">
                    Vuln Score
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('patchLevel')} className="h-8 px-2">
                    Patch Level
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAssets.map((asset) => (
                <TableRow key={asset.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{asset.type}</div>
                      <div className="text-xs text-muted-foreground">{asset.category}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{asset.location}</TableCell>
                  <TableCell className="text-sm">{asset.zone}</TableCell>
                  <TableCell className="text-sm">{asset.owner}</TableCell>
                  <TableCell>
                    <Badge className={getCriticalityColor(asset.criticality)}>
                      {asset.criticality.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`text-lg ${getVulnScoreColor(asset.vulnScore)}`}>
                      {asset.vulnScore.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-lg ${getPatchLevelColor(asset.patchLevel)}`}>
                      {asset.patchLevel}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {asset.compliance.slice(0, 2).map((framework) => (
                        <Badge key={framework} variant="outline" className="text-xs">
                          {framework}
                        </Badge>
                      ))}
                      {asset.compliance.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{asset.compliance.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(asset)}
                      className="h-8"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};