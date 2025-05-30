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
import DesireLevel from "./[id]/DesireLevel";
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
import { BUCKETS, currencies, DEFAULT_IMAGE_URL } from "@/lib/constants";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { getListsOptions } from "./actions";
import { ImageUploader } from "@/components/ImageUploader";
import { fileUploadService } from "@/lib/fileUploadService";
import { useSession } from "next-auth/react";

interface WishDialogProps {
  wish: Wish | null;
  listId?: string;
  onClose: () => void;
  onSubmitAction: (
    data: WishSchemaType,
    id: string,
  ) => Promise<{ success: boolean; error?: string }>;
}

/**
 * A dialog to create or edit a wish. Pass `null` for `wish` to create a new wish. Pass `wish` to edit an existing wish.
 *
 * For `listId`, pass the ID of the list if you are editing a wish. If creating a new wish, `listId` is not required.
 *
 * @example
 * <WishDialog wish={wish} listId={listId} onClose={onClose} onSubmitAction={editWishAction} />
 *
 * @example
 * <WishDialog wish={null} onClose={onClose} onSubmitAction={createWishAction} />
 */
export function WishDialog({
  wish = null,
  listId,
  onClose,
  onSubmitAction,
}: WishDialogProps) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const isEditing = !!wish; // isEditing is true, so wish and listId are not null
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const [lists, setLists] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    async function loadLists() {
      const fetchedLists = await getListsOptions();
      if (fetchedLists.success) {
        setLists(fetchedLists.data);
      }
    }
    loadLists();
  }, []);

  const form = useForm<WishSchemaType>({
    resolver: zodResolver(wishSchema),
    defaultValues: {
      listId,
      title: wish?.title || "",
      desireLvl: wish?.desireLvl || 1,
      price: wish?.price || 0,
      currency: wish?.currency || "UAH",
      url: wish?.url || "",
      description: wish?.description || "",
      desiredGiftDate: wish?.desiredGiftDate
        ? new Date(wish.desiredGiftDate)
        : undefined,
      imageUrl: wish?.imageUrl || DEFAULT_IMAGE_URL,
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: WishSchemaType) => {
    const entityId = isEditing ? wish!.id : "";
    const userId = session?.user?.id!;

    const imageUrl =
      compressedFile && userId
        ? await fileUploadService.uploadFile(
            compressedFile,
            userId,
            BUCKETS.IMAGES,
          )
        : values.imageUrl;

    const { success, error } = await onSubmitAction(
      { ...values, imageUrl },
      entityId,
    );

    toast({
      title: success ? "Wish edited successfully!" : "Failed editing wish",
      description: success ? undefined : error,
      variant: success ? undefined : "destructive",
    });

    if (success) onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit wish" : "Create wish"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Make changes to your wish here."
              : "Fill in the details for your new wish."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ImageUploader
              onCompressed={(file) => setCompressedFile(file)}
              imageUrl={form.watch("imageUrl") as string}
              deleteImage={() => {
                setCompressedFile(null);
                form.setValue("imageUrl", DEFAULT_IMAGE_URL);
                setIsCompressing(false);
              }}
              isCompressing={isCompressing}
              setIsCompressing={setIsCompressing}
            />

            <FormField
              control={form.control}
              name="listId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select List</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a list" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lists.map(({ id, name }) => (
                        <SelectItem key={id} value={id} disabled={isEditing}>
                          {name}
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

            <div className="flex gap-4">
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
                  <FormItem className="flex flex-col">
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
                            <span className="text-muted-foreground">
                              {name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                <FormItem className="flex flex-col relative">
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
                        selected={
                          field.value === null ? undefined : field.value
                        }
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="absolute top-1/2 -translate-y-1/2 right-1"
                    onClick={() =>
                      form.setValue("desiredGiftDate", null, {
                        shouldValidate: true,
                      })
                    }
                  >
                    Clear
                  </Button>
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

            <Button disabled={isCompressing} type="submit">
              {isEditing ? "Save" : "Create"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
