"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Textarea,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Badge,
  Spinner,
  PageSpinner,
  Modal,
  ToastProvider,
  useToast,
} from "@shared/components";

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button size="sm" variant="secondary" onClick={() => toast("Operación exitosa", "success")}>
        Success
      </Button>
      <Button size="sm" variant="secondary" onClick={() => toast("Ocurrió un error inesperado", "error")}>
        Error
      </Button>
      <Button size="sm" variant="secondary" onClick={() => toast("Revisá los datos ingresados", "warning")}>
        Warning
      </Button>
      <Button size="sm" variant="secondary" onClick={() => toast("Actualización disponible", "info")}>
        Info
      </Button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-[--font-display] text-xl font-semibold text-[--color-text] border-b border-[--color-border] pb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ColorSwatch({ name, hex, className }: { name: string; hex: string; className: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`h-14 rounded-[--radius-lg] border border-[--color-border] ${className}`} />
      <div>
        <p className="text-xs font-medium text-[--color-text]">{name}</p>
        <p className="text-xs text-[--color-text-muted] font-mono">{hex}</p>
      </div>
    </div>
  );
}

export default function DesignPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");

  return (
    <ToastProvider>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-16">
        {/* Header */}
        <div>
          <h1 className="font-[--font-display] text-4xl font-bold text-[--color-text]">
            Design System
          </h1>
          <p className="mt-2 text-[--color-text-muted]">
            Paleta, tipografía y componentes de ImNotPhound.
          </p>
        </div>

        {/* Colores */}
        <Section title="Colores">
          <div>
            <p className="text-sm font-medium text-[--color-text-muted] mb-3">Fondos y superficies</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              <ColorSwatch name="Header" hex="#0a0a0a" className="bg-[#0a0a0a]" />
              <ColorSwatch name="BG / Main" hex="#161618" className="bg-[#161618]" />
              <ColorSwatch name="Footer" hex="#111113" className="bg-[#111113]" />
              <ColorSwatch name="Card" hex="#1a1a2e" className="bg-[#1a1a2e]" />
              <ColorSwatch name="Border" hex="#2d3748" className="bg-[#2d3748]" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-[--color-text-muted] mb-3">Primario — Índigo</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              <ColorSwatch name="Primary" hex="#6366f1" className="bg-[#6366f1]" />
              <ColorSwatch name="Hover" hex="#4f46e5" className="bg-[#4f46e5]" />
              <ColorSwatch name="Light" hex="#818cf8" className="bg-[#818cf8]" />
              <ColorSwatch name="Muted" hex="#312e81" className="bg-[#312e81]" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-[--color-text-muted] mb-3">Estados</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <ColorSwatch name="Success" hex="#22c55e" className="bg-[#22c55e]" />
              <ColorSwatch name="Warning" hex="#f59e0b" className="bg-[#f59e0b]" />
              <ColorSwatch name="Danger" hex="#ef4444" className="bg-[#ef4444]" />
              <ColorSwatch name="Info" hex="#06b6d4" className="bg-[#06b6d4]" />
            </div>
          </div>
        </Section>

        {/* Tipografía */}
        <Section title="Tipografía">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs text-[--color-text-muted] mb-1 font-mono">Space Grotesk — Display</p>
              <p className="font-[--font-display] text-5xl font-bold text-[--color-text]">iPhone 16 Pro</p>
              <p className="font-[--font-display] text-3xl font-semibold text-[--color-text]">Samsung Galaxy S25</p>
              <p className="font-[--font-display] text-xl font-medium text-[--color-text]">Pixel 9 Pro XL</p>
            </div>
            <div>
              <p className="text-xs text-[--color-text-muted] mb-1 font-mono">DM Sans — Body</p>
              <p className="text-lg text-[--color-text]">Catálogo curado de smartphones premium.</p>
              <p className="text-base text-[--color-text-muted]">Encontrá el teléfono que se adapta a tu vida y tu presupuesto.</p>
              <p className="text-sm text-[--color-text-subtle]">Texto terciario — hints, placeholders, metadata</p>
            </div>
          </div>
        </Section>

        {/* Buttons */}
        <Section title="Botones">
          <div>
            <p className="text-sm text-[--color-text-muted] mb-3">Variantes</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="primary" loading>Loading</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
          </div>
          <div>
            <p className="text-sm text-[--color-text-muted] mb-3">Tamaños</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
        </Section>

        {/* Badges */}
        <Section title="Badges">
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">En stock</Badge>
            <Badge variant="warning">Pocas unidades</Badge>
            <Badge variant="danger">Sin stock</Badge>
            <Badge variant="info">Oferta</Badge>
          </div>
        </Section>

        {/* Inputs */}
        <Section title="Formularios">
          <div className="grid sm:grid-cols-2 gap-6">
            <Input
              label="Email"
              placeholder="tu@email.com"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input
              label="Con error"
              placeholder="Campo requerido"
              error="Este campo es obligatorio"
            />
            <Input
              label="Con hint"
              placeholder="Nombre del producto"
              hint="Máximo 100 caracteres"
            />
            <Input label="Deshabilitado" placeholder="No editable" disabled />
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <Textarea label="Comentario" placeholder="Escribí tu comentario..." hint="Máximo 500 caracteres" />
            <Select label="Marca" placeholder="Seleccioná una marca">
              <option value="apple">Apple</option>
              <option value="samsung">Samsung</option>
              <option value="google">Google</option>
              <option value="xiaomi">Xiaomi</option>
            </Select>
          </div>
        </Section>

        {/* Cards */}
        <Section title="Cards">
          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>iPhone 16 Pro</CardTitle>
                <CardDescription>El más avanzado de Apple con chip A18 Pro</CardDescription>
              </CardHeader>
              <p className="text-sm text-[--color-text-muted]">256 GB · Titanio Negro</p>
              <CardFooter>
                <div className="flex items-center justify-between">
                  <span className="font-[--font-display] text-xl font-bold text-[--color-text]">$1.299</span>
                  <Button size="sm">Agregar al carrito</Button>
                </div>
              </CardFooter>
            </Card>
            <Card hoverable>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Samsung Galaxy S25</CardTitle>
                    <CardDescription>Snapdragon 8 Elite · 12 GB RAM</CardDescription>
                  </div>
                  <Badge variant="success">En stock</Badge>
                </div>
              </CardHeader>
              <p className="text-sm text-[--color-text-muted]">128 GB · Phantom Black</p>
              <CardFooter>
                <div className="flex items-center justify-between">
                  <span className="font-[--font-display] text-xl font-bold text-[--color-text]">$999</span>
                  <Button size="sm" variant="secondary">Ver más</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </Section>

        {/* Spinners */}
        <Section title="Spinners">
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <Spinner size="sm" />
              <p className="text-xs text-[--color-text-muted]">Small</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner size="md" />
              <p className="text-xs text-[--color-text-muted]">Medium</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner size="lg" />
              <p className="text-xs text-[--color-text-muted]">Large</p>
            </div>
          </div>
          <div className="border border-[--color-border] rounded-[--radius-lg] overflow-hidden">
            <PageSpinner />
          </div>
        </Section>

        {/* Modal */}
        <Section title="Modal">
          <div>
            <Button onClick={() => setModalOpen(true)}>Abrir modal</Button>
            <Modal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Confirmar compra"
              description="Revisá los datos antes de confirmar."
            >
              <div className="flex flex-col gap-4">
                <p className="text-sm text-[--color-text-muted]">
                  iPhone 16 Pro — 256 GB · Titanio Negro
                </p>
                <p className="font-[--font-display] text-2xl font-bold text-[--color-text]">$1.299</p>
                <div className="flex gap-3 justify-end">
                  <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
                  <Button onClick={() => setModalOpen(false)}>Confirmar</Button>
                </div>
              </div>
            </Modal>
          </div>
        </Section>

        {/* Toast */}
        <Section title="Toast / Notificaciones">
          <ToastDemo />
        </Section>
      </div>
    </ToastProvider>
  );
}
