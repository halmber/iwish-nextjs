"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, UserX, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
} from "@/app/(dashboard)/actions";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FRIENDS_TABS } from "@/lib/constants";

interface FriendUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface FriendRequest {
  id: string;
  sender: FriendUser;
}

interface FriendsListProps {
  friends: FriendUser[];
  pendingRequests: FriendRequest[];
}

export function FriendsList({ friends, pendingRequests }: FriendsListProps) {
  const [localFriends, setLocalFriends] = useState(friends);
  const [localRequests, setLocalRequests] = useState(pendingRequests);
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabFromUrl = searchParams.get("tab") ?? FRIENDS_TABS.FRIENDS;
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  const handleRemoveFriend = async (friendId: string) => {
    try {
      const result = await removeFriend(friendId);
      if (result.success) {
        setLocalFriends((prev) => prev.filter((f) => f.id !== friendId));
        toast({ title: "Friend removed" });
      } else if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      toast({
        title: "Error",
        description: "Failed to remove friend",
        variant: "destructive",
      });
    }
  };

  const handleAcceptRequest = async (friendshipId: string) => {
    try {
      const result = await acceptFriendRequest(friendshipId);
      if (result.success) {
        const sender = localRequests.find((r) => r.id === friendshipId)?.sender;
        if (sender) {
          setLocalFriends((prev) => [...prev, sender]);
        }
        // Remove from pending requests
        setLocalRequests((prev) => prev.filter((r) => r.id !== friendshipId));
        toast({ title: "Friend request accepted" });
      } else if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      toast({
        title: "Error",
        description: "Failed to accept friend request",
        variant: "destructive",
      });
    }
  };

  const handleDeclineRequest = async (friendshipId: string) => {
    try {
      const result = await declineFriendRequest(friendshipId);
      if (result.success) {
        setLocalRequests((prev) => prev.filter((r) => r.id !== friendshipId));
        toast({ title: "Friend request declined" });
      } else if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error declining request:", error);
      toast({
        title: "Error",
        description: "Failed to decline friend request",
        variant: "destructive",
      });
    }
  };

  return (
    <Tabs
      defaultValue={FRIENDS_TABS.FRIENDS}
      value={activeTab}
      onValueChange={(tab) => {
        const params = new URLSearchParams(searchParams);
        params.set("tab", tab);
        router.replace(`${pathname}?${params.toString()}`);
        setActiveTab(tab);
      }}
    >
      <TabsList className="mb-4">
        <TabsTrigger value={FRIENDS_TABS.FRIENDS}>
          Friends ({localFriends.length})
        </TabsTrigger>
        <TabsTrigger value="requests">
          Requests ({localRequests.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value={FRIENDS_TABS.FRIENDS}>
        {localFriends.length === 0 ? (
          <div className="text-center p-8 bg-muted rounded-lg">
            <p className="text-muted-foreground">
              You don&apos;t have any friends yet.
            </p>
            <p className="text-muted-foreground">
              Search for users to add them as friends.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localFriends.map((friend) => (
              <Card key={friend.id}>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    {friend.image ? (
                      <Image
                        src={friend.image || ""}
                        alt={friend.name || "Friend"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {friend.name || "User"}
                    </CardTitle>
                    <CardDescription>{friend.email}</CardDescription>
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-between pt-2">
                  <Link href={`/friends/${friend.id}`}>
                    <Button size="sm" variant="outline">
                      View Profile
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => handleRemoveFriend(friend.id)}
                  >
                    <UserX className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value={FRIENDS_TABS.REQUESTS}>
        {localRequests.length === 0 ? (
          <div className="text-center p-8 bg-muted rounded-lg">
            <p className="text-muted-foreground">
              You don&apos;t have any pending friend requests.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    {request.sender.image ? (
                      <Image
                        src={request.sender.image || ""}
                        alt={request.sender.name || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {request.sender.name || "User"}
                    </CardTitle>
                    <CardDescription>{request.sender.email}</CardDescription>
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-between pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeclineRequest(request.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
