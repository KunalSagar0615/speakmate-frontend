import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Input } from "../../components/common/UI";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { getErrorMessage } from "../../utils/errorMessages";

const REGISTER_FIELDS = [
  { key: "name", label: "Name", autoComplete: "name" },
  { key: "username", label: "Username", autoComplete: "off" },
  { key: "email", label: "Email", type: "email", autoComplete: "email" },
  { key: "mobileNumber", label: "Mobile Number", type: "tel", autoComplete: "tel" },
  { key: "country", label: "Country", autoComplete: "country-name" },
  { key: "highestEducation", label: "Highest Education", autoComplete: "off" },
  { key: "currentOccupation", label: "Current Occupation", autoComplete: "organization-title" },
  { key: "password", label: "Password", type: "password", autoComplete: "new-password" },
];

export const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", remember: true });

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = await login({ username: form.username, password: form.password });
    navigate(data.role === "ADMIN" ? "/admin" : "/dashboard");
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold">Welcome Back</h2>
      <form className="mt-4 space-y-3" onSubmit={onSubmit} autoComplete="off">
        <Input
          label="Username"
          name="speakmate-username"
          id="speakmate-username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          autoComplete="off"
          inputMode="text"
        />
        <div className="relative">
          <Input
            label="Password"
            name="speakmate-password"
            id="speakmate-password"
            type={show ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-slate-500"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(e) => setForm({ ...form, remember: e.target.checked })}
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-primary">
            Forgot password?
          </Link>
        </div>
        <Button className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
        <p className="text-sm">
          New user?{" "}
          <Link className="text-primary" to="/register">
            Register
          </Link>
        </p>
      </form>
    </Card>
  );
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    mobileNumber: "",
    country: "",
    highestEducation: "",
    currentOccupation: "",
    password: "",
  });
  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register(form);
      toast.success("Registration successful. Verify your OTP.");
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };
  return (
    <Card>
      <h2 className="text-2xl font-bold">Create your account</h2>
      <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={onSubmit} autoComplete="off">
        {REGISTER_FIELDS.map(({ key, label, type = "text", autoComplete }) => (
          <Input
            key={key}
            label={label}
            name={`speakmate-${key}`}
            id={`speakmate-${key}`}
            type={type}
            value={form[key]}
            onChange={(e) => onChange(key, e.target.value)}
            autoComplete={autoComplete}
          />
        ))}
        <Button className="md:col-span-2">Register</Button>
      </form>
    </Card>
  );
};

export const OtpVerifyPage = () => {
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(location.state?.email || "");
  const navigate = useNavigate();

  const verify = async () => {
    try {
      await authService.verifyOtp({ email, otp });
      toast.success("Email verified. Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold">OTP Verification</h2>
      <p className="mt-2 text-sm text-slate-500">OTP is valid for 5 minutes</p>
      <div className="mt-4 space-y-3">
        <Input
          label="Email"
          name="speakmate-otp-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          inputMode="email"
        />
        <Input
          label="OTP"
          name="speakmate-otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          autoComplete="one-time-code"
          inputMode="numeric"
        />
        <div className="flex gap-2">
          <Button onClick={verify}>Verify OTP</Button>
          <Button
            variant="secondary"
            onClick={async () => {
              try {
                await authService.resendOtp(email);
                toast.success("OTP resent");
              } catch (error) {
                toast.error(getErrorMessage(error));
              }
            }}
          >
            Resend OTP
          </Button>
        </div>
      </div>
    </Card>
  );
};

export const ForgotPasswordPage = () => (
  <Card>
    <h2 className="text-2xl font-bold">Forgot Password</h2>
    <p className="mt-2 text-sm text-slate-500">
      Password reset UI placeholder (connect backend endpoint when available).
    </p>
  </Card>
);
