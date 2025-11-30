import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ClipboardList, User, Calendar } from "lucide-react";

export const RemediationWorkflow = () => {
  const workflows = [
    {
      id: "1",
      cve: "CVE-2024-1234",
      title: "Apache HTTP Server RCE",
      priority: "Critical",
      status: "In Progress",
      progress: 65,
      assignee: "John Doe",
      dueDate: "2024-11-26",
      steps: {
        completed: 3,
        total: 5,
      },
      tasks: [
        { name: "Vulnerability Assessment", status: "completed" },
        { name: "Impact Analysis", status: "completed" },
        { name: "Testing in Dev", status: "completed" },
        { name: "Deploy to Staging", status: "in-progress" },
        { name: "Production Deployment", status: "pending" },
      ],
    },
    {
      id: "2",
      cve: "CVE-2024-5678",
      title: "Windows Server Privilege Escalation",
      priority: "High",
      status: "Testing",
      progress: 80,
      assignee: "Jane Smith",
      dueDate: "2024-11-27",
      steps: {
        completed: 4,
        total: 5,
      },
      tasks: [
        { name: "Vulnerability Assessment", status: "completed" },
        { name: "Impact Analysis", status: "completed" },
        { name: "Testing in Dev", status: "completed" },
        { name: "Deploy to Staging", status: "completed" },
        { name: "Production Deployment", status: "in-progress" },
      ],
    },
    {
      id: "3",
      cve: "CVE-2024-9012",
      title: "Oracle Database SQL Injection",
      priority: "High",
      status: "Approved",
      progress: 100,
      assignee: "Mike Johnson",
      dueDate: "2024-11-25",
      steps: {
        completed: 5,
        total: 5,
      },
      tasks: [
        { name: "Vulnerability Assessment", status: "completed" },
        { name: "Impact Analysis", status: "completed" },
        { name: "Testing in Dev", status: "completed" },
        { name: "Deploy to Staging", status: "completed" },
        { name: "Production Deployment", status: "completed" },
      ],
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "bg-critical text-critical-foreground";
      case "high":
        return "bg-high text-high-foreground";
      case "medium":
        return "bg-medium text-medium-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-safe text-safe-foreground";
      case "in progress":
        return "bg-primary text-primary-foreground";
      case "testing":
        return "bg-medium text-medium-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Remediation Workflows
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="p-4 rounded-lg border border-border bg-card"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {workflow.cve}
                      </Badge>
                      <Badge className={getPriorityColor(workflow.priority)}>
                        {workflow.priority}
                      </Badge>
                      <Badge className={getStatusColor(workflow.status)}>
                        {workflow.status}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-sm">{workflow.title}</h4>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress: {workflow.steps.completed}/{workflow.steps.total} steps</span>
                    <span>{workflow.progress}%</span>
                  </div>
                  <Progress value={workflow.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[10px]">
                        {getInitials(workflow.assignee)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-muted-foreground">{workflow.assignee}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Due: {workflow.dueDate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
