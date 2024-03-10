import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-profile-button";
import React from "react";
import {Switch} from "@nextui-org/react";
export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {

  const registerProfile = async (formData: FormData) => {
    "use server";

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return redirect("/login?message=Please log in to update your profile");
    }

    const userId = session.user.id;
    const origin = headers().get("origin");
    const first_name = formData.get("first_name") as string;
    const last_name = formData.get("last_name") as string;
    const organization = formData.get("organization") as string;
    const is_student = formData.get("is_student")==="Yes";
    const student_email = formData.get("student_email") as string;



    if (!student_email.endsWith(".edu")) {
      return redirect("/signup?message=Student accounts must use a .edu email address");
    }
    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      first_name,
      last_name,
      organization,
      is_student,
      student_email
    });

    if (error) {
      return redirect(`/signup?message=${encodeURIComponent(error.message)}`);
    }

    // Redirect to dashboard upon successful profile update.
    return redirect("/dashboard");
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>

      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="first_name">
          First Name
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="first_name"
          placeholder="Vitalik"
          required
        />
        <label className="text-md" htmlFor="last_name">
          Last Name
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="last_name"
          placeholder="Buterin"
          required
        />
        {/* Organization Field */}
        <label className="text-md" htmlFor="organization">Organization</label>
        <input className="rounded-md px-4 py-2 bg-inherit border mb-6" name="organization" placeholder="Waterloo Blockchain" />

        {/* Student or Oraganization, should be slider not this */}
        <label className="text-md" htmlFor="is_student">Are you a Student? </label>
        <input className="rounded-md px-4 py-2 bg-inherit border mb-6" name="is_student" placeholder="Yes" />

        {/* Student Email */}
        <label className="text-md" htmlFor=".edu">Student Email </label>
        <input className="rounded-md px-4 py-2 bg-inherit border mb-6" name="student_email" placeholder="vbuterin@waterloo.edu" />

        <SubmitButton
          formAction={registerProfile}
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Creating Profile..."
        >
          Register Profile
        </SubmitButton>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
