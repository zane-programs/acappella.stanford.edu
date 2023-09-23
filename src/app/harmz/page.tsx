import { RedirectType, redirect } from "next/navigation";

export default function HarmzRedirect() {
  redirect("/harmonics", RedirectType.replace);
}
