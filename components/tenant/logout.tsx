"use client"

import { Button } from "@/components/ui/button"

export function ButtonLogout() {
    return (
        <Button variant="destructive" onClick={() => {
            localStorage.removeItem("token")
            window.location.href = "/login"
        }}>Logout</Button>
    )
}