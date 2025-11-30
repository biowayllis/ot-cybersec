import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Globe, Plus, Trash2, Shield, AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GeofencingRule {
  id: string;
  rule_name: string;
  rule_type: "allow" | "block";
  country_codes: string[];
  is_active: boolean;
  created_at: string;
}

// Common country codes and names
const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "RU", name: "Russia" },
  { code: "KR", name: "South Korea" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "PL", name: "Poland" },
  { code: "TR", name: "Turkey" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "TH", name: "Thailand" },
  { code: "ID", name: "Indonesia" },
  { code: "PH", name: "Philippines" },
  { code: "VN", name: "Vietnam" },
  { code: "ZA", name: "South Africa" },
  { code: "NG", name: "Nigeria" },
  { code: "EG", name: "Egypt" },
  { code: "KP", name: "North Korea" },
  { code: "IR", name: "Iran" },
  { code: "SY", name: "Syria" },
  { code: "CU", name: "Cuba" },
  { code: "SD", name: "Sudan" },
];

export const GeofencingSettings = () => {
  const queryClient = useQueryClient();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newRule, setNewRule] = useState({
    rule_name: "",
    rule_type: "allow" as "allow" | "block",
    country_codes: [] as string[],
  });
  const [selectedCountry, setSelectedCountry] = useState("");

  const { data: rules, isLoading } = useQuery({
    queryKey: ['geofencing-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('geofencing_rules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as GeofencingRule[];
    },
  });

  const createRule = useMutation({
    mutationFn: async (rule: typeof newRule) => {
      const { error } = await supabase
        .from('geofencing_rules')
        .insert({
          rule_name: rule.rule_name,
          rule_type: rule.rule_type,
          country_codes: rule.country_codes,
          is_active: true,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geofencing-rules'] });
      toast.success("Geofencing rule created successfully");
      setShowAddDialog(false);
      setNewRule({ rule_name: "", rule_type: "allow", country_codes: [] });
    },
    onError: (error) => {
      toast.error(`Failed to create rule: ${error.message}`);
    },
  });

  const toggleRule = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('geofencing_rules')
        .update({ is_active })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geofencing-rules'] });
      toast.success("Rule updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update rule: ${error.message}`);
    },
  });

  const deleteRule = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('geofencing_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geofencing-rules'] });
      toast.success("Rule deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete rule: ${error.message}`);
    },
  });

  const handleAddCountry = () => {
    if (selectedCountry && !newRule.country_codes.includes(selectedCountry)) {
      setNewRule({
        ...newRule,
        country_codes: [...newRule.country_codes, selectedCountry],
      });
      setSelectedCountry("");
    }
  };

  const handleRemoveCountry = (code: string) => {
    setNewRule({
      ...newRule,
      country_codes: newRule.country_codes.filter(c => c !== code),
    });
  };

  const handleCreateRule = () => {
    if (!newRule.rule_name.trim()) {
      toast.error("Please enter a rule name");
      return;
    }
    if (newRule.country_codes.length === 0) {
      toast.error("Please add at least one country");
      return;
    }
    createRule.mutate(newRule);
  };

  const getCountryName = (code: string) => {
    return COUNTRIES.find(c => c.code === code)?.name || code;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Geofencing Rules
            </CardTitle>
            <CardDescription>
              Restrict or allow login access based on geographic location
            </CardDescription>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Geofencing Rule</DialogTitle>
                <DialogDescription>
                  Define a new rule to allow or block access from specific countries
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rule-name">Rule Name</Label>
                  <Input
                    id="rule-name"
                    placeholder="e.g., Allow US and EU access"
                    value={newRule.rule_name}
                    onChange={(e) => setNewRule({ ...newRule, rule_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rule-type">Rule Type</Label>
                  <Select
                    value={newRule.rule_type}
                    onValueChange={(value: "allow" | "block") => 
                      setNewRule({ ...newRule, rule_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="allow">Allow</SelectItem>
                      <SelectItem value="block">Block</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Countries</Label>
                  <div className="flex gap-2">
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name} ({country.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={handleAddCountry} size="sm">
                      Add
                    </Button>
                  </div>
                  {newRule.country_codes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newRule.country_codes.map((code) => (
                        <Badge key={code} variant="secondary" className="gap-1">
                          {getCountryName(code)}
                          <button
                            onClick={() => handleRemoveCountry(code)}
                            className="ml-1 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <Button onClick={handleCreateRule} className="w-full">
                  Create Rule
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {!rules || rules.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No geofencing rules configured</p>
            <p className="text-sm mt-2">Click "Add Rule" to create your first rule</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-start justify-between p-4 border rounded-lg bg-card"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <h4 className="font-medium">{rule.rule_name}</h4>
                    <Badge variant={rule.rule_type === "allow" ? "default" : "destructive"}>
                      {rule.rule_type}
                    </Badge>
                    {!rule.is_active && (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {rule.country_codes.map((code) => (
                      <Badge key={code} variant="secondary">
                        {getCountryName(code)}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Switch
                    checked={rule.is_active}
                    onCheckedChange={(checked) =>
                      toggleRule.mutate({ id: rule.id, is_active: checked })
                    }
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteRule.mutate(rule.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};