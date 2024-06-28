import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../../components/ui/button";
import { ModeToggle } from "../../components/ui/mode-toggle";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import { Progress } from "../../components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../../components/ui/dropdown-menu";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";

import { ReceiptIndianRupee, Badge, BadgeCheck } from "lucide-react";

const Donate = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["token"]);
  const [username, setUsername] = useState("");
  const [progress, setProgress] = useState(0);
  const [userStatus, setUserStatus] = useState(false);
  const [title, setTitle] = useState();
  const [targetAmt, setTargetAmt] = useState(0);
  const [amtRaised, setAmtRaised] = useState(0);
  const [donationAmount, setDonationAmount] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const getCampaign = async () => {
      try {
        const { data: verification } = await axios.get(
          "https://seedstake.onrender.com/verify",
          {
            withCredentials: true,
          }
        );
        if (!verification.status) {
          removeCookie("token");
          navigate("/login");
          return;
        }

        const { data } = await axios.get(`https://seedstake.onrender.com/search/${id}`, {
          withCredentials: true,
        });

        const { title, description, targetAmount, amountRaised, isActive } =
          data;
        setProgress((amountRaised / targetAmount) * 100);
        setTitle(title);
        setAmtRaised(amountRaised);
        setTargetAmt(targetAmount);
      } catch (error) {
        console.error("There was an error verifying the cookie:", error);
        removeCookie("token");
        navigate("/login");
      }
    };

    getCampaign();
  }, [id, cookies.token, navigate, removeCookie]);

  useEffect(() => {
    const verifyCookie = async () => {
      try {
        const { data: verification } = await axios.get(
          "https://seedstake.onrender.com/verify",
          {
            withCredentials: true,
          }
        );
        if (!verification.status) {
          removeCookie("token");
          navigate("/login");
          return;
        }

        const { data } = await axios.get("https://seedstake.onrender.com/", {
          withCredentials: true,
        });

        const { status, user, isAdmin } = data;
        if (status) {
          setUsername(user);
          if (isAdmin) {
            setUserStatus(isAdmin);
          }
        } else {
          removeCookie("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("There was an error verifying the cookie:", error);
        removeCookie("token");
        navigate("/login");
      }
    };

    verifyCookie();
  }, [cookies.token, navigate, removeCookie]);

  const Logout = () => {
    removeCookie("token");
    navigate("/login");
  };

  const handleInputChange = (e) => {
    setDonationAmount(e.target.value);
  };

  const handleAnonymousToggle = () => {
    setIsAnonymous(!isAnonymous);
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-right",
      hideProgressBar: false,
      autoClose: 3000,
      theme: "dark",
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
      hideProgressBar: false,
      autoClose: 2500,
      theme: "dark",
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!donationAmount || donationAmount <= 0) {
      handleError("Please enter a valid donation amount");
      return;
    }

    try {
      const campaignId = id;

      const amount = parseFloat(donationAmount);

      const { data } = await axios.post(
        `https://seedstake.onrender.com/campaigns/${campaignId}/donate`,
        {
          amount: amount,
          isAnonymous: isAnonymous,
        },{ withCredentials: true }
      );
      setTimeout(() => {
      window.location.reload();
      }, 3000);
      handleSuccess(`You've donated $${donationAmount} as ${isAnonymous ? "Anonymous" : username}`);
      setDonationAmount("");
      setIsAnonymous(false);
    } catch (error) {
      console.error('Error making donation:', error);
      handleError("There was an error processing your donation. Please try again.");
    }
  };


  return (
    <>
    <header className="flex items-center justify-between px-4 py-3 border-b-2">
      <span className="text-lg font-medium">SeedStake</span>
      <div className="flex items-center gap-4">
        {userStatus ? (
          <ReceiptIndianRupee
            className="h-6 w-6 text-gray-400"
            onClick={() => navigate("/donations")}
          />
        ) : (
          <div />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full border w-8 h-8"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>{username.charAt(1)}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{username}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ModeToggle />
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={Logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <main className="container mx-auto my-12 px-4 md:px-6 lg:my-16 lg:px-8 xl:my-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div>
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                {title}
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Help us build a better future
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Your donation will make a real difference in the lives of
                those in need. Join us in our mission to create a more
                equitable and sustainable world.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Fundraising Goal</span>
                <span className="text-sm font-medium">${targetAmt}</span>
              </div>
              <Progress value={progress} className="h-4" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Raised</span>
                <span className="text-sm font-medium">${amtRaised}</span>
              </div>
            </div>
          </div>
          <Card className="w-full max-w-md">
            <form onSubmit={handleDonate}>
              <CardHeader>
                <CardTitle>Donate Now</CardTitle>
                <CardDescription>
                  Your contribution will make a real difference.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <RadioGroup
                    id="payment-method"
                    defaultValue="credit-card"
                    className="flex items-center gap-2"
                  >
                    <Label
                      htmlFor="credit-card"
                      className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                    >
                      <RadioGroupItem id="credit-card" value="credit-card" />
                      Credit Card
                    </Label>
                    <Label
                      htmlFor="paypal"
                      className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                    >
                      <RadioGroupItem id="paypal" value="paypal" />
                      PayPal
                    </Label>
                  </RadioGroup>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="expiry-month">Expiry Month</Label>
                    <Select id="expiry-month" defaultValue="01">
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="01">01</SelectItem>
                        <SelectItem value="02">02</SelectItem>
                        <SelectItem value="03">03</SelectItem>
                        <SelectItem value="04">04</SelectItem>
                        <SelectItem value="05">05</SelectItem>
                        <SelectItem value="06">06</SelectItem>
                        <SelectItem value="07">07</SelectItem>
                        <SelectItem value="08">08</SelectItem>
                        <SelectItem value="09">09</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="11">11</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="expiry-year">Expiry Year</Label>
                    <Select id="expiry-year" defaultValue="2023">
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                        <SelectItem value="2027">2027</SelectItem>
                        <SelectItem value="2028">2028</SelectItem>
                        <SelectItem value="2029">2029</SelectItem>
                        <SelectItem value="2030">2030</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" type="text" placeholder="123" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="donation-amount">Donation Amount</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setDonationAmount("10")}
                      variant="outline"
                      size="sm"
                      type="button"
                    >
                      $10
                    </Button>
                    <Button
                      onClick={() => setDonationAmount("25")}
                      variant="outline"
                      size="sm"
                      type="button"
                    >
                      $25
                    </Button>
                    <Button
                      onClick={() => setDonationAmount("50")}
                      variant="outline"
                      size="sm"
                      type="button"
                    >
                      $50
                    </Button>
                    <Button
                      onClick={() => setDonationAmount("100")}
                      variant="outline"
                      size="sm"
                      type="button"
                    >
                      $100
                    </Button>
                    <Input
                      value={donationAmount}
                      onChange={handleInputChange}
                      type="number"
                      placeholder="Enter custom amount"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="link"
                    className="flex items-center text-sm font-medium"
                    onClick={handleAnonymousToggle}
                    type="button"
                  >
                    <div className="mr-2">
                      {isAnonymous ? (
                        <BadgeCheck className="h-6 w-6" />
                      ) : (
                        <Badge className="h-6 w-6" />
                      )}
                    </div>
                    Make this an anonymous donation
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Donate Now
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
    <ToastContainer />
  </>
  );
};

export default Donate;
