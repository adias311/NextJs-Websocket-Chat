import { UserButton } from "@clerk/nextjs";
 
export default function Home() {
  return (
    <div>
      <UserButton afterSignOutUrl="/"/>
      <h1 className="">/Home</h1>
    </div>
  )
}