import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function UserAvatar({
  image,
  name,
}: {
  image: string | null;
  name: string | null;
}) {
  return (
    <Avatar className="h-8 w-8 rounded-lg">
      <AvatarImage
        className=" object-cover"
        src={image || ""}
        alt={name || "User image"}
      />
      <AvatarFallback className="rounded-lg">
        {name
          ?.split(" ")
          .map((n) => n[0].toLocaleUpperCase())
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
}
