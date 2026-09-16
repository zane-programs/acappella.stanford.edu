"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/app/lib/cn";

/**
 * Styled Radix DropdownMenu. Compose:
 *
 *   <Menu>
 *     <MenuTrigger asChild><Button …/></MenuTrigger>
 *     <MenuContent>
 *       <MenuItem asChild><a href=…>Google Calendar</a></MenuItem>
 *     </MenuContent>
 *   </Menu>
 */
export const Menu = DropdownMenu.Root;
export const MenuTrigger = DropdownMenu.Trigger;

export const MenuContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DropdownMenu.Content>
>(function MenuContent({ className, sideOffset = 6, align = "start", ...rest }, ref) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        ref={ref}
        sideOffset={sideOffset}
        align={align}
        collisionPadding={12}
        className={cn(
          "z-[105] min-w-[220px] rounded-md bg-white p-1.5 text-black ring-1 ring-black-10 shadow-elevated",
          "data-[state=open]:animate-[menu-in_150ms_var(--ease-out-expo)]",
          className
        )}
        {...rest}
      />
    </DropdownMenu.Portal>
  );
});

export const MenuItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DropdownMenu.Item>
>(function MenuItem({ className, ...rest }, ref) {
  return (
    <DropdownMenu.Item
      ref={ref}
      className={cn(
        "flex min-h-11 cursor-pointer select-none items-center gap-2 rounded-sm px-3 py-2 text-[0.9375rem] font-medium outline-none",
        "data-[highlighted]:bg-fog-light data-[highlighted]:text-cardinal",
        "[&_a]:flex [&_a]:w-full [&_a]:items-center [&_a]:gap-2",
        className
      )}
      {...rest}
    />
  );
});

export const MenuLabel = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DropdownMenu.Label>
>(function MenuLabel({ className, ...rest }, ref) {
  return (
    <DropdownMenu.Label
      ref={ref}
      className={cn("px-3 pb-1 pt-2 type-eyebrow text-black-60", className)}
      {...rest}
    />
  );
});

export const MenuSeparator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DropdownMenu.Separator>
>(function MenuSeparator({ className, ...rest }, ref) {
  return (
    <DropdownMenu.Separator ref={ref} className={cn("my-1 h-px bg-black-10", className)} {...rest} />
  );
});
