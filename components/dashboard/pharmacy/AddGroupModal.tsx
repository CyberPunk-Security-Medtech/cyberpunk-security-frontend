"use client";

import { useState } from "react";
import Modal from "@components/Modal";
import { inventoryService } from "@services/api";
import { toast } from "react-toastify";

type Props = { isOpen: boolean; onClose: () => void; orgId: string | null; onGroupAdded: () => void };

export default function AddGroupModal({ isOpen, onClose, orgId, onGroupAdded }: Props) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!orgId || !name.trim()) return toast.error("Enter a group name.");
    
    setSaving(true);
    try { 
      // Added 'unit' to satisfy the API requirements
      await inventoryService.createInventoryItem(orgId, { 
        name: `[Group Placeholder] ${name.trim()}`,
        unit: "N/A",
        form: name.trim(),
      }); 
      
      toast.success("Medicine group created."); 
      setName(""); 
      onGroupAdded(); 
      onClose(); 
    } catch (error) { 
      console.error("Failed to create group", error); 
      toast.error("Unable to create this group."); 
    } finally { 
      setSaving(false); 
    }
  };

  return (
    <Modal title="Create medicine group" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4 p-6">
        <p className="text-sm text-[#5B6478]">
          Enter a name for the new medicine group. You can add medicines to this group later.
        </p>

        <label className="block text-sm text-[#2D3648]">
          Group name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 h-10 w-full rounded-md border border-[#CED7E3] bg-white p-2 text-sm text-[#2D3648] placeholder:text-[#8B93A7] outline-none"
            placeholder="e.g. Antibiotics"
            autoFocus
          />
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-md border border-[#CED7E3] bg-white px-4 py-2 text-sm font-medium text-[#2D3648] hover:bg-[#F7F9FB]">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving}
            className="rounded-md bg-[#00796B] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#00695F] disabled:opacity-60"
          >
            {saving ? "Creating..." : "Create group"}
          </button>
        </div>
      </div>
    </Modal>
  );
}