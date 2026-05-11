"use client";

import { useState } from "react";
import { Button } from "@shared/components/Button";
import { Card } from "@shared/components/Card";
import { Modal } from "@shared/components/Modal";
import { AddressCard } from "./AddressCard";
import { AddressForm } from "./AddressForm";
import type { AddressFormValues } from "./AddressForm";
import type { Address, AddressPayload } from "../types/profile.types";

interface AddressListProps {
  addresses: Address[];
  onAdd: (payload: AddressPayload) => Promise<unknown>;
  onUpdate: (id: string, payload: Partial<AddressPayload>) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
  isLoading: boolean;
}

export function AddressList({ addresses, onAdd, onUpdate, onDelete, isLoading }: AddressListProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(address: Address) {
    setEditing(address);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  async function handleSubmit(data: AddressFormValues) {
    if (editing) {
      await onUpdate(editing.id, {
        street: data.street,
        city: data.city,
        state: data.state || undefined,
        country: data.country,
        zipCode: data.zipCode,
        isDefault: data.isDefault,
      });
    } else {
      await onAdd({
        street: data.street,
        city: data.city,
        state: data.state || undefined,
        country: data.country,
        zipCode: data.zipCode,
        isDefault: data.isDefault,
      });
    }
    closeModal();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-[--font-display] text-lg font-semibold text-text">Mis direcciones</h2>
        <Button
          size="sm"
          onClick={openCreate}
          variant="subtle"
        >
          Agregar dirección
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <p className="text-sm text-text-muted text-center py-4">Aún no tenés direcciones guardadas</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {[...addresses]
            .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0))
            .map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={() => openEdit(address)}
                onDelete={() => onDelete(address.id)}
              />
            ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={closeModal} size="lg">
        <AddressForm
          address={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isLoading={isLoading}
          title={editing ? "Editar dirección" : "Agregar dirección"}
        />
      </Modal>
    </div>
  );
}
