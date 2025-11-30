import { CyberPostureScore } from "@/components/executive/CyberPostureScore";
import { RiskHeatmap } from "@/components/executive/RiskHeatmap";
import { AssetOverview } from "@/components/executive/AssetOverview";
import { VulnerabilityOverview } from "@/components/executive/VulnerabilityOverview";
import { ComplianceStatus } from "@/components/executive/ComplianceStatus";
import { LatestAlerts } from "@/components/executive/LatestAlerts";
import { SecurityScoreDashboard } from "@/components/SecurityScoreDashboard";

const Index = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Executive Overview</h1>
        <p className="text-muted-foreground">Real-time cybersecurity posture across IT and OT environments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CyberPostureScore />
        </div>
        
        <div className="lg:col-span-2">
          <RiskHeatmap />
        </div>
      </div>

      <AssetOverview />

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Personal Security Assessment</h2>
          <SecurityScoreDashboard />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VulnerabilityOverview />
        <ComplianceStatus />
      </div>

      <LatestAlerts />

      <div className="text-xs text-muted-foreground text-center py-4 border-t border-border">
        Powered by ICSCore Systems • IT + OT/ICS Unified Security Architecture
      </div>
    </div>
  );
};

export default Index;
