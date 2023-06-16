import { useState, useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/data.js";

function Login() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  // const { login } = api;

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [data, setData] = useState(null);

  const { username, password } = credentials;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const login = async () => {
    try {
      const { data } = await axios("/api/auth/login", {
        method: "POST",
        data: credentials,
      });

      //store it locally
      localStorage.setItem("token", data.token);
      auth.login();
      console.log(auth);
      console.log(data.message, data.token);
      setData(data.message);
    } catch (error) {
      console.log(error);
      setData("Login failed, please try again");
    }
  };

  return (
    <div>
      <div>
        <h2>Log in to get started</h2>
        <div className="input-div">
          <input
            value={username}
            onChange={handleChange}
            name="username"
            type="text"
            placeholder="Username"
            className="login-input"
          />
        </div>
        <div className="input-div-bottom">
          <input
            value={password}
            onChange={handleChange}
            name="password"
            type="password"
            placeholder="Password"
            className="login-input"
          />
        </div>
        <div>
          <button className="signup-btn" onClick={login}>
            Log in
          </button>
        </div>
        <p>
          Not a user yet? <Link to="/register">Sign Up</Link>
        </p>

        <div>
          <p>{data}</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
