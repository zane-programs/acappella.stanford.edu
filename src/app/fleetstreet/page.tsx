import { RedirectType, redirect } from "next/navigation";

export default function FleetStreetRedirect() {
  redirect("/fleet-street", RedirectType.push);
}
