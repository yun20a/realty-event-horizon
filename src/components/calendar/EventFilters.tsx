
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Participant } from "@/types/events";
import { Filter } from "lucide-react";

interface EventFiltersProps {
  agents: Participant[];
  onFilterChange: (filters: EventFilterOptions) => void;
}

export interface EventFilterOptions {
  types: string[];
  agents: string[];
  statuses: string[];
  searchTerm: string;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  agents,
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<EventFilterOptions>({
    types: ["property", "client", "contract", "internal", "followup"],
    agents: [],
    statuses: ["scheduled", "pending", "completed"],
    searchTerm: "",
  });

  const eventTypes = [
    { value: "property", label: "Property Viewing" },
    { value: "client", label: "Client Meeting" },
    { value: "contract", label: "Contract Signing" },
    { value: "internal", label: "Internal Meeting" },
    { value: "followup", label: "Follow-up" },
  ];

  const eventStatuses = [
    { value: "scheduled", label: "Scheduled" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const handleEventTypeToggle = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    
    const newFilters = { ...filters, types: newTypes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAgentToggle = (agentId: string) => {
    const newAgents = filters.agents.includes(agentId)
      ? filters.agents.filter(a => a !== agentId)
      : [...filters.agents, agentId];
    
    const newFilters = { ...filters, agents: newAgents };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStatusToggle = (status: string) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    
    const newFilters = { ...filters, statuses: newStatuses };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, searchTerm: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 px-1">
      <div className="w-full sm:w-64">
        <Input
          placeholder="Search events..."
          value={filters.searchTerm}
          onChange={handleSearchChange}
          className="w-full"
        />
      </div>

      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> 
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>Event Types</DropdownMenuLabel>
            {eventTypes.map((type) => (
              <DropdownMenuCheckboxItem
                key={type.value}
                checked={filters.types.includes(type.value)}
                onCheckedChange={() => handleEventTypeToggle(type.value)}
              >
                {type.label}
              </DropdownMenuCheckboxItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Agents</DropdownMenuLabel>
            {agents
              .filter(agent => agent.role === "agent")
              .map((agent) => (
                <DropdownMenuCheckboxItem
                  key={agent.id}
                  checked={filters.agents.includes(agent.id)}
                  onCheckedChange={() => handleAgentToggle(agent.id)}
                >
                  {agent.name}
                </DropdownMenuCheckboxItem>
              ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            {eventStatuses.map((status) => (
              <DropdownMenuCheckboxItem
                key={status.value}
                checked={filters.statuses.includes(status.value)}
                onCheckedChange={() => handleStatusToggle(status.value)}
              >
                {status.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
