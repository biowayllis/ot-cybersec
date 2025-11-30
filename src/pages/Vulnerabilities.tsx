import { VulnerabilityStats } from "@/components/vulnerabilities/VulnerabilityStats";
import { VulnerabilityCVEList } from "@/components/vulnerabilities/VulnerabilityCVEList";
import { PatchTimeline } from "@/components/vulnerabilities/PatchTimeline";
import { VendorAdvisories } from "@/components/vulnerabilities/VendorAdvisories";
import { RemediationWorkflow } from "@/components/vulnerabilities/RemediationWorkflow";

const Vulnerabilities = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Vulnerability & Patch Management</h1>
        <p className="text-muted-foreground">
          Comprehensive CVE tracking, CVSS scoring, and patch remediation workflows
        </p>
      </div>

      <VulnerabilityStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VulnerabilityCVEList />
        </div>
        <div>
          <PatchTimeline />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VendorAdvisories />
        <RemediationWorkflow />
      </div>
    </div>
  );
};

export default Vulnerabilities;
