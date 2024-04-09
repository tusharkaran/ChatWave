import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClick = () => setShowPassword(!showPassword);
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = ChatState();

  const history = useHistory();
  const handleSignInClick = () => {
    console.log("check")
    const signInContainer = document.getElementsByClassName('sign-in-container');
    const signUpContainer = document.getElementsByClassName('sign-up-container');
    console.log("check", signInContainer, signUpContainer);
    if (signInContainer && signUpContainer) {

      signInContainer[0].style.display = 'none';
      signUpContainer[0].style.display = 'block';
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please fill in all fields.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <div className="data-form">
      <h1>Sign in</h1>
      <span>or use your account</span>
      <input
        value={email}
        placeholder="Enter your Email ID"
        onChange={(e) => setEmail(e.target.value)}
        borderColor="gray.400" // Added border color
        _focus={{ borderColor: "blue.400" }} // Added focus style
      />
      <input
        value={password}
        placeholder="Enter your Password"
        type={showPassword ? "text" : "password"}
        onChange={(e) => setPassword(e.target.value)}
        borderColor="gray.400" // Added border color
        _focus={{ borderColor: "blue.400" }} // Added focus style
      />
      <button onClick={submitHandler}
        isLoading={loading}>Sign In</button>
      <button class="create-account" onClick={handleSignInClick}
      >Create Account</button>
    </div>
  );
};

export default Login;
