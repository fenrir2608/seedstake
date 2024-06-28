import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "../../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"

const Signup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });
  const { email, password, username } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "top-center",
      hideProgressBar: true,
      autoClose: 500,
      theme: "dark",
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,

    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "https://seedstake.onrender.com/signup",
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
          navigate("/");
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
      username: "",
    });
  };

  return (
    <>
    <Card className="mx-auto max-w-sm mt-16">
    <form onSubmit={handleSubmit}>
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">Email</Label>
              <Input             
            type="email"
            name="email"
            value={email} 
            onChange={handleOnChange}
            />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Username</Label>
              <Input 
              type="text"
              name="username"
              value={username}
              onChange={handleOnChange}
              />
            </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
            type="password"
            name="password"
            value={password}
            onChange={handleOnChange}         
            />
          </div>
          <Button type="submit" className="w-full">
            Create an account
          </Button>
          <Button disabled variant="outline" className="w-full">
            Continue with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link className="underline" to={"/login"}>Login</Link>
        </div>
      </CardContent>
      </form>
    </Card>
    <ToastContainer />
    </>
  );
};

export default Signup;