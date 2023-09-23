import { RedirectType, redirect } from "next/navigation";

export default function EPRedirect() {
  redirect("/everyday-people", RedirectType.replace);
}
