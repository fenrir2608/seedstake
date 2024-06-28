import { Skeleton } from "./skeleton"
import { Card, CardContent, CardHeader } from "./card"
import {
  HandCoins,
  ReceiptIndianRupee,
  UsersRound,
  Settings,
  Handshake,
  Search,
  ArrowLeft,
} from "lucide-react";
import { Avatar,  AvatarFallback, AvatarImage, } from "./avatar";
import { Button } from "./button";

export default function LoadingSkeleton() {
    return (
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 lg:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-[60px] items-center border-b px-6">
            <div className="flex items-center gap-2 font-semibold">
                <HandCoins className="h-8 w-8" />
                <span className="text-lg">Donation Dashboard</span>
              </div>
            </div>
            <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
                <div
                  className="cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <ReceiptIndianRupee className="h-6 w-6" />
                  Donations
                </div>
                <div
                  className="cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Handshake className="h-6 w-6" />
                  Campaigns
                </div>
                <div
                  className="cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <UsersRound className="h-6 w-6" />
                  Donors
                </div>
                <div
                  className="cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Settings className="h-6 w-6" />
                  Settings
                </div>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
            
            <div className="w-full flex-1">
              <Skeleton className="h-8 w-full" />
            </div>
            <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>{`ツ`}</AvatarFallback>
            </Avatar>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <div className="flex items-center gap-4">
            <Button
                variant="outline"
                size="icon"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-12 w-full" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-12 w-full" />
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    )
  }
