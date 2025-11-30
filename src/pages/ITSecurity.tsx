import { ITAssetOverview } from "@/components/it-security/ITAssetOverview";
import { SIEMDetections } from "@/components/it-security/SIEMDetections";
import { XDRAlerts } from "@/components/it-security/XDRAlerts";
import { VulnerabilitySummary } from "@/components/it-security/VulnerabilitySummary";
import { PatchCompliance } from "@/components/it-security/PatchCompliance";
import { ChangeRequests } from "@/components/it-security/ChangeRequests";
import { ControlValidation } from "@/components/it-security/ControlValidation";

const ITSecurity = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">IT Security Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive IT security monitoring and threat detection
        </p>
      </div>

      <ITAssetOverview />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SIEMDetections />
        <XDRAlerts />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VulnerabilitySummary />
        <PatchCompliance />
      </div>

      <ChangeRequests />

      <ControlValidation />
    </div>
  );
};

export default ITSecurity;
