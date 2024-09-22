import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  src?: string;
  className?: string;
}

export function UserAvatar({ className, src }: UserAvatarProps) {
  return (
    <Avatar className={cn("size-7 md:size-10", className)}>
      <AvatarImage src={src} />
    </Avatar>
  );
}
