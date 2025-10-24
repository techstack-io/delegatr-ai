// components/UserMenu.tsx
"use client";
import React from "react";
import { UserButton } from "@clerk/nextjs";

type Props = {
  appearance?: any;
};

export default function UserMenu({ appearance }: Props) {
  return <UserButton appearance={appearance} />;
}
