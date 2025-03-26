"use client";

import { useState } from "react";
import Image from "next/image";
import { User, UserPlus, UserCheck, Clock, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
} from "@/app/(dashboard)/actions";
import { useToast } from "@/hooks/use-toast";

interface UserResult {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  status: string;
  friendshipId?: string | null;
}

export function UserSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (query.length < 2) {
      toast({ title: "Please enter at least 2 characters to search" });
      return;
    }

    setIsSearching(true);
    try {
      const result = await searchUsers(query);
      if (result.success) {
        setResults(result.users);
      } else if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search users",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    try {
      const result = await sendFriendRequest(userId);
      if (result.success) {
        // Update the local state to reflect the sent request
        setResults((prev) =>
          prev.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  status: "pending",
                  friendshipId: result.friendship.id,
                }
              : user,
          ),
        );
        toast({ title: "Friend request sent" });
      } else if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send friend request",
        variant: "destructive",
      });
    }
  };

  const handleAcceptRequest = async (friendshipId: string, userId: string) => {
    try {
      const result = await acceptFriendRequest(friendshipId);
      if (result.success) {
        // Update the local state to reflect the accepted request
        setResults((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, status: "accepted" } : user,
          ),
        );
        toast({ title: "Friend request accepted" });
      } else if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast({
        title: "Error",
        description: "Failed to accept friend request",
        variant: "destructive",
      });
    }
  };

  const handleDeclineRequest = async (friendshipId: string, userId: string) => {
    try {
      const result = await declineFriendRequest(friendshipId);
      if (result.success) {
        // Update the local state to reflect the declined request
        setResults((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, status: "rejected" } : user,
          ),
        );
        toast({ title: "Friend request declined" });
      } else if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decline friend request",
        variant: "destructive",
      });
    }
  };

  const getActionButton = (user: UserResult) => {
    switch (user.status) {
      case "accepted":
        return (
          <Button size="sm" variant="ghost" disabled>
            <UserCheck className="h-4 w-4 mr-1" />
            Friends
          </Button>
        );
      case "pending":
        return (
          <Button size="sm" variant="ghost" disabled>
            <Clock className="h-4 w-4 mr-1" />
            Pending
          </Button>
        );
      case "received_pending":
        return (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              className="px-2"
              onClick={() =>
                user.friendshipId &&
                handleAcceptRequest(user.friendshipId, user.id)
              }
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="px-2"
              onClick={() =>
                user.friendshipId &&
                handleDeclineRequest(user.friendshipId, user.id)
              }
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        );
      default:
        return (
          <Button size="sm" onClick={() => handleSendRequest(user.id)}>
            <UserPlus className="h-4 w-4 mr-1" />
            Add
          </Button>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Friends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search by name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>

        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden">
                    {user.image ? (
                      <Image
                        src={user.image || ""}
                        alt={user.name || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{user.name || "User"}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>

                {getActionButton(user)}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-muted-foreground">
              {query.length > 0
                ? "No users found. Try a different search term."
                : "Search for users by name or email."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
