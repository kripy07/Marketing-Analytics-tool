import { Check, ChevronsUpDown, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function UserSwitcher() {
  const { user, profile, isAdmin } = useAuth();

  if (!user) return null;

  return (
    <div className="w-full p-2 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src={profile?.avatar_url} />
          <AvatarFallback>
            {profile?.first_name?.[0] || user?.email?.[0] || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start flex-1">
          <span className="text-sm font-medium">
            {profile?.first_name && profile?.last_name 
              ? `${profile.first_name} ${profile.last_name}`
              : user?.email}
          </span>
          <span className="text-xs text-muted-foreground">
            {isAdmin ? 'Admin' : 'User'}
          </span>
        </div>
      </div>
    </div>
  );
}