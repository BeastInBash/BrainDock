'use client'

import { Spinner } from "@/components/spinner"
import { Button } from "@/components/ui/button"
import { SignInButton } from "@clerk/clerk-react"
import { useConvexAuth } from "convex/react"
import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth()


  return (
    <div className="max-w-3xl space-y-4 ">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold ">Your Ideas, Documents, &amp; Plans. Unified.  Welcom to {" "}
        <span className="underline">Tracker</span>
      </h1>
      <h3 className="sm:text-xl md:text-2xl font-medium text-base">
        Tracker is the connected workspace where <br /> better, faster work happens.
      </h3>
      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <Spinner size={'lg'} />
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href={'/documents'}>
            Enter Tracker <ArrowRightIcon className="h-4 w-4 ml-4" />
          </Link>
        </Button>
      )}

      {!isAuthenticated && !isLoading && (
        <SignInButton>
          <Button >
            Get Tracker Free
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </Button>
        </SignInButton>
      )}

    </div>
  )
}
