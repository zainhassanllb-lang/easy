"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Loader2, Mail, CheckCircle, ShieldCheck, Lock } from "lucide-react";
import Link from "next/link";

type Step = "email" | "otp" | "reset";

export function ForgotPasswordForm() {
    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    // ✅ OTP timer (10 minutes)
    const OTP_EXPIRES_IN_SECONDS = 10 * 60;
    const [otpSecondsLeft, setOtpSecondsLeft] = useState<number>(0);

    // ✅ optional: resend cooldown (30s) so user doesn’t spam
    const RESEND_COOLDOWN_SECONDS = 30;
    const [resendSecondsLeft, setResendSecondsLeft] = useState<number>(0);

    // Countdown for OTP expiry (runs only on OTP step)
    useEffect(() => {
        if (step !== "otp") return;
        if (otpSecondsLeft <= 0) return;

        const t = setInterval(() => {
            setOtpSecondsLeft((s) => (s > 0 ? s - 1 : 0));
        }, 1000);

        return () => clearInterval(t);
    }, [step, otpSecondsLeft]);

    // Countdown for resend cooldown
    useEffect(() => {
        if (step !== "otp") return;
        if (resendSecondsLeft <= 0) return;

        const t = setInterval(() => {
            setResendSecondsLeft((s) => (s > 0 ? s - 1 : 0));
        }, 1000);

        return () => clearInterval(t);
    }, [step, resendSecondsLeft]);

    const formatTime = (totalSeconds: number) => {
        const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
        const ss = String(totalSeconds % 60).padStart(2, "0");
        return `${mm}:${ss}`;
    };

    // ✅ Extract sending logic into a function so both "submit" and "resend" can use it
    const sendOtp = async () => {
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch("/api/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (data.success) {
                setStep("otp");
                setMessage("OTP has been sent to your email.");

                // ✅ start timers
                setOtpSecondsLeft(data.expiresInSeconds ?? OTP_EXPIRES_IN_SECONDS);
                setResendSecondsLeft(RESEND_COOLDOWN_SECONDS);

                // optional: clear old otp field
                setOtp("");
            } else {
                setError(data.error || "Failed to send OTP.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await sendOtp();
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ✅ prevent verify after expiry (UX)
        if (otpSecondsLeft <= 0) {
            setError("OTP expired. Please resend code.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();
            if (data.success) {
                setStep("reset");
                setMessage("OTP verified. Please enter your new password.");
            } else {
                setError(data.error || "Invalid OTP.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, password }),
            });

            const data = await res.json();
            if (data.success) {
                setMessage("Password reset successful! Redirecting to login...");
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                setError(data.error || "Failed to reset password.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const canResend = resendSecondsLeft <= 0 && !loading && email;

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    {step === "email" && <Mail className="w-6 h-6 text-primary" />}
                    {step === "otp" && <ShieldCheck className="w-6 h-6 text-primary" />}
                    {step === "reset" && <CheckCircle className="w-6 h-6 text-primary" />}
                    ForgotPassword
                </CardTitle>
                <CardDescription>
                    {step === "email" && "Enter your email to receive a password reset code."}
                    {step === "otp" && `Enter the 6-digit code sent to ${email}`}
                    {step === "reset" && "Create a new strong password for your account."}
                </CardDescription>
            </CardHeader>

            <CardContent>
                {error && (
                    <div className="mb-4 p-2 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
                        {error}
                    </div>
                )}
                {message && !error && (
                    <div className="mb-4 p-2 bg-primary/10 text-primary text-sm rounded-lg border border-primary/20">
                        {message}
                    </div>
                )}

                {step === "email" && (
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pl-10 h-10"
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full h-10" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Code"}
                        </Button>
                    </form>
                )}

                {step === "otp" && (
                    <form onSubmit={handleOtpSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="otp">Verification Code</Label>
                            <Input
                                id="otp"
                                type="text"
                                placeholder="123456"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                className="h-10 text-center text-xl tracking-[8px] font-bold"
                            />
                        </div>

                        {/* ✅ Expiry timer */}
                        <div className="text-sm text-muted-foreground text-center">
                            {otpSecondsLeft > 0 ? (
                                <>Code expires in <span className="font-semibold">{formatTime(otpSecondsLeft)}</span></>
                            ) : (
                                <span className="text-destructive font-semibold">Code expired. Please resend.</span>
                            )}
                        </div>

                        <Button type="submit" className="w-full h-10" disabled={loading || otpSecondsLeft <= 0}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify Code"}
                        </Button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={sendOtp}
                                className="text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!canResend}
                            >
                                {canResend ? "Resend Code" : `Resend in ${resendSecondsLeft}s`}
                            </button>
                        </div>
                    </form>
                )}

                {step === "reset" && (
                    <form onSubmit={handleResetSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="password">New Password</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-10 h-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="pl-10 h-10"
                                    />
                                </div>
                            </div>
                        </div>
                        <Button type="submit" className="w-full h-10" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Reset Password"}
                        </Button>
                    </form>
                )}
            </CardContent>

            <CardFooter className="flex justify-center border-t pt-6 mt-2">
                <Link href="/login" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </Link>
            </CardFooter>
        </Card>
    );
}
