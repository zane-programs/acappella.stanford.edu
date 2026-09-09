/**
 * Translucent button style for use on dark/cardinal backgrounds
 * (promo banners, featured cards). Plain props so it works in both
 * server and client components.
 */
export function onDarkButtonProps(textColor = "white") {
  return {
    background: "rgba(255, 255, 255, 0.2)",
    color: textColor,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgba(255, 255, 255, 0.3)",
    size: { base: "sm", md: "md" },
    fontWeight: "600",
    whiteSpace: "nowrap",
    flexShrink: 0,
    _hover: {
      background: "rgba(255, 255, 255, 0.3)",
      borderColor: "rgba(255, 255, 255, 0.5)",
    },
    _focus: {
      outline: "2px solid",
      outlineColor: textColor,
      outlineOffset: "2px",
    },
  } as const;
}
