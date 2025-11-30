import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Target } from "lucide-react";

interface ThreatIndicator {
  id: string;
  type: string;
  value: string;
  severity: string;
  firstSeen: string;
  lastSeen: string;
  occurrences: number;
  tags: string[];
}

const mockIndicators: ThreatIndicator[] = [
  {
    id: "ioc_001",
    type: "IP Address",
    value: "192.168.100.45",
    severity: "critical",
    firstSeen: "2024-01-15 08:23",
    lastSeen: "2024-01-15 14:45",
    occurrences: 127,
    tags: ["C2", "Malware", "Botnet"]
  },
  {
    id: "ioc_002",
    type: "File Hash",
    value: "a3f2bc5e9d7f8a1b...",
    severity: "high",
    firstSeen: "2024-01-14 22:15",
    lastSeen: "2024-01-15 09:32",
    occurrences: 8,
    tags: ["Ransomware", "Encryption"]
  },
  {
    id: "ioc_003",
    type: "Domain",
    value: "suspicious-domain.net",
    severity: "medium",
    firstSeen: "2024-01-13 15:30",
    lastSeen: "2024-01-15 11:20",
    occurrences: 45,
    tags: ["Phishing", "Credential Theft"]
  },
  {
    id: "ioc_004",
    type: "URL",
    value: "http://malicious-site.com/...",
    severity: "high",
    firstSeen: "2024-01-15 06:45",
    lastSeen: "2024-01-15 13:10",
    occurrences: 23,
    tags: ["Drive-by Download", "Exploit Kit"]
  },
  {
    id: "ioc_005",
    type: "Email",
    value: "attacker@evil.com",
    severity: "critical",
    firstSeen: "2024-01-12 19:20",
    lastSeen: "2024-01-15 10:55",
    occurrences: 156,
    tags: ["Spear Phishing", "BEC"]
  }
];

export const ThreatHunting = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Threat Hunting & IOC Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search IOCs, IPs, domains, file hashes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="ip">IP Address</SelectItem>
              <SelectItem value="domain">Domain</SelectItem>
              <SelectItem value="hash">File Hash</SelectItem>
              <SelectItem value="url">URL</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {mockIndicators.map((indicator) => (
            <div
              key={indicator.id}
              className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {indicator.type}
                    </Badge>
                    <Badge variant="outline" className={`text-${indicator.severity} border-current`}>
                      {indicator.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="font-mono text-sm font-medium text-foreground">{indicator.value}</p>
                  <div className="flex flex-wrap gap-1">
                    {indicator.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground pt-2">
                    <div>
                      <span className="font-medium">First Seen:</span>
                      <p>{indicator.firstSeen}</p>
                    </div>
                    <div>
                      <span className="font-medium">Last Seen:</span>
                      <p>{indicator.lastSeen}</p>
                    </div>
                    <div>
                      <span className="font-medium">Occurrences:</span>
                      <p>{indicator.occurrences}</p>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Investigate
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
