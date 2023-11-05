import { ModeToggle } from "@/components/ui/dark-mode";
import { UserButton } from "@clerk/nextjs";
 
export default function Home() {
  return (
    <div>
      <h1 className="">/Home</h1>
      <UserButton afterSignOutUrl="/"/>
      <ModeToggle/>
    </div>
  )
}