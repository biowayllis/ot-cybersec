import { PurdueModel } from "@/components/ot-security/PurdueModel";
import { OTAssetBreakdown } from "@/components/ot-security/OTAssetBreakdown";
import { OTNetworkMap } from "@/components/ot-security/OTNetworkMap";
import { ICSNDRAlerts } from "@/components/ot-security/ICSNDRAlerts";
import { FirmwareTracking } from "@/components/ot-security/FirmwareTracking";
import { OTVulnerabilities } from "@/components/ot-security/OTVulnerabilities";
import { MaintenanceWindows } from "@/components/ot-security/MaintenanceWindows";
import { OTPatchReadiness } from "@/components/ot-security/OTPatchReadiness";

const OTSecurity = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">OT/ICS Security Dashboard</h1>
        <p className="text-muted-foreground">
          Industrial Control Systems monitoring and Operational Technology security
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PurdueModel />
        <OTAssetBreakdown />
      </div>

      <OTNetworkMap />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ICSNDRAlerts />
        <FirmwareTracking />
      </div>

      <OTVulnerabilities />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MaintenanceWindows />
        <OTPatchReadiness />
      </div>
    </div>
  );
};

export default OTSecurity;
