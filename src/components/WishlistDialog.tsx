import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  wishlistSchema,
  WishlistSchemaType,
} from "@/app/(dashboard)/lists/schemas";
import { List } from "@prisma/client";
import { VISIBILITY } from "@/lib/constants";

const visibilityOptions = [
  { value: "private", label: "Private" },
  { value: "public", label: "Public" },
];

interface WishlistDialogProps {
  wishlist: List | null;
  onClose: () => void;
  onSubmitAction: (
    data: WishlistSchemaType,
    id: string,
  ) => Promise<{ success: boolean; error?: string }>;
}

export function WishlistDialog({
  wishlist = null,
  onClose,
  onSubmitAction,
}: WishlistDialogProps) {
  const isEditing = !!wishlist;
  const updateOrCreateEntityId = wishlist?.id || "null";

  const form = useForm({
    resolver: zodResolver(wishlistSchema),
    defaultValues: {
      name: wishlist?.name || "",
      description: wishlist?.description || "",
      visibility: wishlist?.visibility || VISIBILITY.PUBLIC,
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: WishlistSchemaType) => {
    const response = await onSubmitAction(values, updateOrCreateEntityId);

    if (response.success) {
      toast({
        title: `Wishlist ${isEditing ? "edited" : "created"} successfully!`,
      });
      onClose();
    } else {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Wishlist" : "Create Wishlist"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Make changes to your wishlist."
              : "Fill in the details for your new wishlist."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Wishlist name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Write wishist description here."
                      className="resize-none"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {visibilityOptions.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">{isEditing ? "Save" : "Create"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
