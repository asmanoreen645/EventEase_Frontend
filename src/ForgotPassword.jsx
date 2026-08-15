import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from './api/axiosConfig';
import "./ForgotPassword.css";

const OTP_EXPIRY_SECONDS = 300;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [timer, setTimer] = useState(OTP_EXPIRY_SECONDS);
  const otpInputRefs = useRef([]);

  useEffect(() => {
    if (step !== 2 || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const clearMessages = () => {
    setError("");
    setSuccessMsg("");
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }
    setLoading(true);
    try {
      const response = await API.post("/api/auth/forgot-password", { email });
      setSuccessMsg(response.data?.message || "OTP sent to your email.");
      setStep(2);
      setTimer(OTP_EXPIRY_SECONDS);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "This email is not registered. Please check and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    clearMessages();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }
    if (timer <= 0) {
      setError("OTP has expired. Please request a new one.");
      return;
    }
    setLoading(true);
    try {
      const response = await API.post("/api/auth/verify-otp", {
        email,
        otp: otpValue,
      });
      setSuccessMsg(response.data?.message || "OTP verified. Please set your new password.");
      setStep(3);
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    clearMessages();
    setLoading(true);
    try {
      const response = await API.post("/api/auth/forgot-password", { email });
      setOtp(["", "", "", "", "", ""]);
      setTimer(OTP_EXPIRY_SECONDS);
      setSuccessMsg(response.data?.message || "A new OTP has been sent to your email.");
      otpInputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    clearMessages();
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await API.post("/api/auth/reset-password", {
        email,
        otp: otp.join(""),
        newPassword,
      });
      setSuccessMsg(response.data?.message || "Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-page">
      <div className="fp-card">
        <div className="fp-header">
          <span className="fp-eyebrow">Account recovery</span>
          <h1 className="fp-title">Reset your password</h1>
          <p className="fp-subtitle">
            {step === 1 &&
              "Enter the email linked to your EventEase account and we'll send you a code."}
            {step === 2 && `We sent a 6-digit code to ${email}`}
            {step === 3 && "Choose a new password for your account."}
          </p>
        </div>

        <div className="fp-progress" aria-hidden="true">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`fp-progress-dot ${step >= s ? "fp-progress-dot--active" : ""}`}
            />
          ))}
        </div>

        {error && <div className="fp-alert fp-alert--error">{error}</div>}
        {successMsg && (
          <div className="fp-alert fp-alert--success">{successMsg}</div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="fp-form">
            <label className="fp-label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="fp-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <button type="submit" className="fp-btn" disabled={loading}>
              {loading ? "Sending..." : "Send code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="fp-form">
            <div className="fp-otp-row">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpInputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="fp-otp-box"
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            <div className="fp-otp-meta">
              {timer > 0 ? (
                <span className="fp-timer">Code expires in {formatTime(timer)}</span>
              ) : (
                <span className="fp-timer fp-timer--expired">Code expired</span>
              )}
              <button
                type="button"
                className="fp-link-btn"
                onClick={handleResendOtp}
                disabled={loading || timer > OTP_EXPIRY_SECONDS - 30}
              >
                Resend code
              </button>
            </div>

            <button type="submit" className="fp-btn" disabled={loading}>
              {loading ? "Verifying..." : "Verify code"}
            </button>

            <button
              type="button"
              className="fp-btn-ghost"
              onClick={() => {
                setStep(1);
                clearMessages();
              }}
            >
              Change email
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="fp-form">
            <label className="fp-label" htmlFor="newPassword">
              New password
            </label>
            <input
              id="newPassword"
              type="password"
              className="fp-input"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoFocus
            />

            <label className="fp-label" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="fp-input"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button type="submit" className="fp-btn" disabled={loading}>
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </form>
        )}

        <p className="fp-footer">
          Remembered your password? <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;