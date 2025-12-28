'use client';

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signUpAndRedirect, type ActionResponse } from "@/actions/auth";

export default function SignUpPage() {
  const initialState: ActionResponse = { success: false, message: '' };
  const [state, formAction, isPending] = useActionState(signUpAndRedirect, initialState);

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#121212]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          ALMA Classes
        </h1>
        <h2 className="mt-2 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Create a new account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-[#1A1A1A] py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100 dark:border-dark-border-subtle">
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                disabled={isPending}
                aria-describedby="name-error"
                className={state?.errors?.name ? "border-red-500" : ""}
              />
              <div id="name-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.name && (
                  <p className="text-sm text-red-500">
                    {state.errors.name[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                required
                disabled={isPending}
                aria-describedby="phoneNumber-error"
                className={state?.errors?.phoneNumber ? "border-red-500" : ""}
              />
              <div id="phoneNumber-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.phoneNumber && (
                  <p className="text-sm text-red-500">
                    {state.errors.phoneNumber[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isPending}
                aria-describedby="email-error"
                className={state?.errors?.email ? "border-red-500" : ""}
              />
              <div id="email-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.email && (
                  <p className="text-sm text-red-500">
                    {state.errors.email[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                disabled={isPending}
                aria-describedby="password-error"
                className={state?.errors?.password ? "border-red-500" : ""}
              />
              <div id="password-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.password && (
                  <p className="text-sm text-red-500">
                    {state.errors.password[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                disabled={isPending}
                aria-describedby="confirmPassword-error"
                className={
                  state?.errors?.confirmPassword ? "border-red-500" : ""
                }
              />
              <div id="confirmPassword-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {state.errors.confirmPassword[0]}
                  </p>
                )}
              </div>
            </div>

            {state?.message && !state.success && (
              <div className="text-sm text-red-500" aria-live="polite">
                {state.message}
              </div>
            )}

            <div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Creating account...' : 'Sign up'}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-gray-900 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}