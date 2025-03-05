"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Wish } from "@prisma/client";
import DesireLevel from "./DesireLevel";
import {
  Form,
  FormControl,
  FormLabel,
  FormItem,
  FormField,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { wishSchema, WishSchemaType } from "./schemas";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currencies } from "@/lib/constants";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { editWishAction } from "./actions";

interface EditWishDialogProps {
  wish: Wish;
  listId: string;
  onClose: () => void;
}

export function EditWishDialog({ wish, listId, onClose }: EditWishDialogProps) {
  const { toast } = useToast();

  const form = useForm<WishSchemaType>({
    resolver: zodResolver(wishSchema),
    defaultValues: {
      title: wish.title,
      desireLvl: wish.desireLvl,
      price: wish.price,
      currency: wish.currency,
      url: wish.url || "",
      description: wish.description || "",
      desiredGiftDate:
        (wish.desiredGiftDate && new Date(wish.desiredGiftDate)) || undefined,
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: WishSchemaType) => {
    const response = await editWishAction(values, wish.id);

    if (response.success) {
      toast({ title: "Wish edited successfully!" });
      onClose();
    } else {
      toast({
        title: "Failed editing wish",
        description: response.error,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit wish</DialogTitle>
          <DialogDescription>
            Make changes to your wish here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="The title of the wish." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="desireLvl"
              render={({ field: { value, onChange } }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Desire level</FormLabel>
                  <FormControl>
                    <DesireLevel desireLvl={value} setDesireLvl={onChange} />
                  </FormControl>
                  <FormDescription>
                    The level of desire for the wish.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="The price of wish."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencies.map(({ code, name }) => (
                        <SelectItem key={code} value={code}>
                          {code}{" "}
                          <span className="text-muted-foreground">{name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Url</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="Write the url of the wish here."
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="absolute top-1/2 -translate-y-1/2 right-1"
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            field.onChange(text);
                          } catch (error) {
                            toast({
                              title: "Error during pasting",
                              description: `${error}`,
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        Paste
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="desiredGiftDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="w-fit">Desired gift date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                      placeholder="Write your wish description here."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Save </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
