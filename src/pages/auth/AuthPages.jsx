import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
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
  {
    key: "mobileNumber",
    label: "Mobile Number",
    type: "tel",
    autoComplete: "tel",
  },
  { key: "country", label: "Country", autoComplete: "country-name" },
  {
    key: "highestEducation",
    label: "Highest Education",
    autoComplete: "off",
  },
  {
    key: "currentOccupation",
    label: "Current Occupation",
    autoComplete: "organization-title",
  },
  {
    key: "password",
    label: "Password",
    type: "password",
    autoComplete: "new-password",
  },
];

export const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: true,
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = await login({
      username: form.username,
      password: form.password,
    });

    navigate(
      data.role === "ADMIN"
        ? "/admin"
        : "/dashboard"
    );
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold">
        Welcome Back
      </h2>

      <form
        className="mt-4 space-y-3"
        onSubmit={onSubmit}
        autoComplete="off"
      >
        {/* Hidden fields to catch browser autofill */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-9999px",
            width: "1px",
            height: "1px",
            overflow: "hidden",
          }}
        >
          <input
            type="text"
            name="username"
            autoComplete="username"
            tabIndex={-1}
          />

          <input
            type="password"
            name="password"
            autoComplete="current-password"
            tabIndex={-1}
          />
        </div>
        <Input
          label="Username"
          name="speakmate-username"
          id="speakmate-username"
          value={form.username}
          onChange={(e) =>
            setForm({
              ...form,
              username: e.target.value,
            })
          }
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
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
            autoComplete="current-password"
          />

          <button
            type="button"
            className="absolute right-3 top-9 text-slate-500"
            onClick={() =>
              setShow((current) => !current)
            }
            aria-label={
              show
                ? "Hide password"
                : "Show password"
            }
          >
            {show ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(e) =>
                setForm({
                  ...form,
                  remember: e.target.checked,
                })
              }
            />

            Remember me
          </label>

          <Link
            to="/forgot-password"
            className="text-primary"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          className="w-full"
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </Button>

        <p className="text-sm">
          New user?{" "}
          <Link
            className="text-primary"
            to="/register"
          >
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

  const onChange = (key, value) =>
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await authService.register(form);

      toast.success(
        "Registration successful. Verify your OTP."
      );

      navigate("/verify-otp", {
        state: {
          email: form.email,
        },
      });
    } catch (error) {
      toast.error(
        getErrorMessage(error)
      );
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold">
        Create your account
      </h2>

      <form
        className="mt-4 grid gap-3 md:grid-cols-2"
        onSubmit={onSubmit}
        autoComplete="off"
      >
        {REGISTER_FIELDS.map(
          ({
            key,
            label,
            type = "text",
            autoComplete,
          }) => (
            <Input
              key={key}
              label={label}
              name={`speakmate-${key}`}
              id={`speakmate-${key}`}
              type={type}
              value={form[key]}
              onChange={(e) =>
                onChange(
                  key,
                  e.target.value
                )
              }
              autoComplete={
                autoComplete
              }
            />
          )
        )}

        <Button className="md:col-span-2">
          Register
        </Button>
      </form>
    </Card>
  );
};

export const OtpVerifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");

  const [email, setEmail] = useState(
    location.state?.email || ""
  );

  const verify = async () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!otp.trim()) {
      toast.error("OTP is required");
      return;
    }

    try {
      await authService.verifyOtp({
        email,
        otp,
      });

      toast.success(
        "Email verified. Please login."
      );

      navigate("/login");
    } catch (error) {
      toast.error(
        getErrorMessage(error)
      );
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold">
        OTP Verification
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        OTP is valid for 5 minutes
      </p>

      <div className="mt-4 space-y-3">
        <Input
          label="Email"
          name="speakmate-otp-email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          autoComplete="email"
          inputMode="email"
        />

        <Input
          label="OTP"
          name="speakmate-otp"
          value={otp}
          onChange={(e) =>
            setOtp(
              e.target.value
                .replace(/\D/g, "")
                .slice(0, 6)
            )
          }
          autoComplete="one-time-code"
          inputMode="numeric"
        />

        <div className="flex gap-2">
          <Button onClick={verify}>
            Verify OTP
          </Button>

          <Button
            variant="secondary"
            onClick={async () => {
              try {
                await authService.resendOtp(
                  email
                );

                toast.success(
                  "OTP resent"
                );
              } catch (error) {
                toast.error(
                  getErrorMessage(error)
                );
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

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [resending, setResending] =
    useState(false);

  const [secondsLeft, setSecondsLeft] =
    useState(300);

  useEffect(() => {
    if (step !== 2) {
      return;
    }

    if (secondsLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(
        (current) =>
          Math.max(current - 1, 0)
      );
    }, 1000);

    return () =>
      clearInterval(timer);
  }, [step, secondsLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds =
      seconds % 60;

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const sendResetOtp = async (e) => {
    e.preventDefault();

    const cleanEmail =
      email.trim();

    if (!cleanEmail) {
      toast.error(
        "Please enter your email"
      );
      return;
    }

    setLoading(true);

    try {
      await authService.forgotPassword(
        cleanEmail
      );

      setEmail(cleanEmail);
      setOtp("");
      setSecondsLeft(300);
      setStep(2);

      toast.success(
        "Password reset OTP sent to your email"
      );
    } catch (error) {
      toast.error(
        getErrorMessage(error)
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyResetOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error(
        "Please enter the 6-digit OTP"
      );
      return;
    }

    if (secondsLeft <= 0) {
      toast.error(
        "OTP has expired. Please resend OTP."
      );
      return;
    }

    setLoading(true);

    try {
      await authService
        .verifyPasswordResetOtp(
          email,
          otp
        );

      setStep(3);

      toast.success(
        "OTP verified successfully"
      );
    } catch (error) {
      toast.error(
        getErrorMessage(error)
      );
    } finally {
      setLoading(false);
    }
  };

  const resendResetOtp = async () => {
    if (resending) {
      return;
    }

    setResending(true);

    try {
      await authService
        .resendPasswordResetOtp(
          email
        );

      setOtp("");
      setSecondsLeft(300);

      toast.success(
        "New OTP sent successfully"
      );
    } catch (error) {
      toast.error(
        getErrorMessage(error)
      );
    } finally {
      setResending(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error(
        "Password must contain at least 8 characters"
      );
      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      toast.error(
        "Passwords do not match"
      );
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(
        email,
        newPassword,
        confirmPassword
      );

      toast.success(
        "Password reset successfully. Please login."
      );

      navigate(
        "/login",
        { replace: true }
      );
    } catch (error) {
      toast.error(
        getErrorMessage(error)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      {step === 1 && (
        <>
          <h2 className="text-2xl font-bold">
            Forgot Password
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Enter the email associated
            with your SpeakMate account.
            We'll send you a verification
            code.
          </p>

          <form
            className="mt-4 space-y-4"
            onSubmit={sendResetOtp}
          >
            <Input
              label="Email"
              name="forgot-password-email"
              id="forgot-password-email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              autoComplete="email"
              inputMode="email"
            />

            <Button
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Sending OTP..."
                : "Send OTP"}
            </Button>

            <p className="text-center text-sm text-slate-500">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-primary"
              >
                Back to login
              </Link>
            </p>
          </form>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-2xl font-bold">
            Verify OTP
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Enter the 6-digit OTP sent to{" "}
            <span className="font-medium text-slate-300">
              {email}
            </span>
          </p>

          <form
            className="mt-4 space-y-4"
            onSubmit={verifyResetOtp}
          >
            <Input
              label="OTP"
              name="password-reset-otp"
              id="password-reset-otp"
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value
                    .replace(
                      /\D/g,
                      ""
                    )
                    .slice(0, 6)
                )
              }
              autoComplete="one-time-code"
              inputMode="numeric"
            />

            <div className="flex items-center justify-between text-sm">
              <span
                className={
                  secondsLeft > 0
                    ? "text-slate-500"
                    : "text-red-400"
                }
              >
                {secondsLeft > 0
                  ? `OTP expires in ${formatTime(
                    secondsLeft
                  )}`
                  : "OTP expired"}
              </span>

              <button
                type="button"
                onClick={
                  resendResetOtp
                }
                disabled={
                  resending
                }
                className="text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {resending
                  ? "Sending..."
                  : "Resend OTP"}
              </button>
            </div>

            <Button
              className="w-full"
              disabled={
                loading ||
                otp.length !== 6 ||
                secondsLeft <= 0
              }
            >
              {loading
                ? "Verifying..."
                : "Verify OTP"}
            </Button>

            <button
              type="button"
              className="w-full text-sm text-slate-500 hover:text-primary"
              onClick={() => {
                setStep(1);
                setOtp("");
                setSecondsLeft(300);
              }}
            >
              Change email
            </button>
          </form>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="text-2xl font-bold">
            Create New Password
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Enter a new password for
            your SpeakMate account.
          </p>

          <form
            className="mt-4 space-y-4"
            onSubmit={resetPassword}
          >
            <div className="relative">
              <Input
                label="New Password"
                name="new-password"
                id="new-password"
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                autoComplete="new-password"
              />

              <button
                type="button"
                className="absolute right-3 top-9 text-slate-500"
                onClick={() =>
                  setShowNewPassword(
                    (current) =>
                      !current
                  )
                }
                aria-label={
                  showNewPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showNewPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm Password"
                name="confirm-password"
                id="confirm-password"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={
                  confirmPassword
                }
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                autoComplete="new-password"
              />

              <button
                type="button"
                className="absolute right-3 top-9 text-slate-500"
                onClick={() =>
                  setShowConfirmPassword(
                    (current) =>
                      !current
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Password must contain at
              least 8 characters.
            </p>

            <Button
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Resetting password..."
                : "Reset Password"}
            </Button>
          </form>
        </>
      )}
    </Card>
  );
};