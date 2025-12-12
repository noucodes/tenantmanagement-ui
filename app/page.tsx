import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const cookieStore = cookies()          // ❗ no await
  const token = cookieStore.get("token")?.value

  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/me", {
    cache: "no-store",
    headers: {
      Cookie: `token=${token}`,
    },
  })

  if (!res.ok) {
    redirect("/login")
  }

  const user = await res.json()

  return (
    <div className="min-h-screen bg-background">
      {/* your UI here */}
    </div>
  )
}
