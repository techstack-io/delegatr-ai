"use client";

import React from "react";
type Props = { leadId?: string; leadName?: string; onOpen?: (lead?: { id?: string; name?: string }) => void };
export default function AddToProjectButton({ leadId, leadName, onOpen }: Props) {
  return (
    <button type="button" onClick={() => onOpen?.({ id: leadId, name: leadName })} className="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:bg-gray-50">
      Add to Project
    </button>
  );
}
