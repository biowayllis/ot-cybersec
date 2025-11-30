import { NetworkTopology } from "@/components/architecture/NetworkTopology";
import { Card } from "@/components/ui/card";
import { Shield, Network, Lock } from "lucide-react";

const Architecture = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Platform Architecture</h1>
        <p className="text-muted-foreground">
          Interactive IT/OT infrastructure topology with network zones and security controls
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Network className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">6</p>
              <p className="text-xs text-muted-foreground">Network Zones</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-safe/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-safe" />
            </div>
            <div>
              <p className="text-2xl font-bold">15</p>
              <p className="text-xs text-muted-foreground">Security Controls</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs text-muted-foreground">Purdue Levels</p>
            </div>
          </div>
        </Card>
      </div>

      <NetworkTopology />

      <div className="text-xs text-muted-foreground text-center py-4 border-t border-border">
        Purdue Model Architecture • ISA/IEC 62443 Compliant
      </div>
    </div>
  );
};

export default Architecture;
