import React, { useEffect } from "react";
import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import CustomLink from "../CustomLink";
import { commonModalClasses } from "../../utils/theme";
import FormContainer from "../form/FormContainer";
import { useState } from "react";
import { useNotification } from "../../hooks";
import { useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "../../utils/helper";

const validateUserInfo = ({ email, password }) => {
  // regular expression is to valid name or invalid name (for example if i will put numbers inside the name is invalid if i put only letters is valid).same with the email
  if (!email.trim()) return { ok: false, error: "Email is missing!" };
  if (!isValidEmail(email)) return { ok: false, error: "Invalid email" };

  if (!password.trim()) return { ok: false, error: "Password is missing!" };
  if (password.length < 8)
    return { ok: false, error: "Password must be 8 characters at least!" };
    
  return { ok: true };
};

// form signIn component for cleaner code
export default function SignIn() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { updateNotification } = useNotification();
  const { handleLogin, authInfo } = useAuth();
  const { isPending, isLoggedIn } = authInfo;

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // did not "reload the page"
    const { ok, error } = validateUserInfo(userInfo); //variables with the ok and error messages in userInfo

    if (!ok) return updateNotification("error", error); //if its not ok the info return the updating error
    handleLogin(userInfo.email, userInfo.password); //sending this email and password
  };

  // useEffect(() => {
  //   if (isLoggedIn) navigate("/"); //we want to move our user to somewhere else
  // }, [isLoggedIn]);

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + " w-72"}>
          <Title>Sign in </Title>
          <FormInput
            value={userInfo.email}
            onChange={handleChange}
            label="Email"
            placeholder="Email address"
            name="email"
          />
          <FormInput
            value={userInfo.password}
            onChange={handleChange}
            label="Password"
            placeholder="********"
            name="password"
            type="password"
          />
          <Submit value="Sign in" busy={isPending} />

          <div className="flex justify-between">
            <CustomLink to="/auth/forget-password">Forget password</CustomLink>
            <CustomLink to="/auth/signUp">Sign up</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
