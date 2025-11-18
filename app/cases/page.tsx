"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "../../app/amplifyClient";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
    Check,
    ClipboardList,
    Loader2,
    LogOut,
    Pencil,
    Plus,
    Save,
    Trash2,
    X,
} from "lucide-react";
import { toast } from "sonner";

const client = generateClient<Schema>();
type Case = Schema["Case"]["type"];

const STATUS_LABEL: Record<string, string> = {
    abierto: "Abierto",
    en_proceso: "En proceso",
    cerrado: "Cerrado",
};

function getErrorMessage(e: unknown): string {
    if (e instanceof Error) return e.message;
    if (typeof e === "string") return e;

    if (e && typeof e === "object" && "message" in e) {
        const { message } = e as { message?: unknown };
        return typeof message === "string" ? message : String(message);
    }

    return "Unknown error";
}

export default function CasesPage() {
    return (
        <div className="auth-shell">
            <Authenticator>
                {({ signOut, user }) => (
                    <div className="cases-root">
                        <CasesScreen
                            signOut={() => signOut?.()}
                            userEmail={user?.signInDetails?.loginId ?? user?.username ?? ""}
                        />
                    </div>
                )}
            </Authenticator>
        </div>
    );
}

function CasesScreen({
                         signOut,
                         userEmail,
                     }: {
    signOut: () => void;
    userEmail: string;
}) {
    const [items, setItems] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [estado, setEstado] = useState("abierto");
    const [showForm, setShowForm] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    async function refresh() {
        setLoading(true);
        try {
            const { data } = await client.models.Case.list();
            setItems(data);
        } catch (e: unknown) {
            toast.error(getErrorMessage(e) || "No se pudieron cargar los expedientes.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refresh();
    }, []);

    async function onCreate(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await client.models.Case.create({ nombre, descripcion, estado });
            setNombre("");
            setDescripcion("");
            setEstado("abierto");
            setShowForm(false);
            toast.success("Expediente creado correctamente.");
            await refresh();
        } catch (e: unknown) {
            toast.error(getErrorMessage(e) || "Error al crear el expediente.");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function onUpdate(e: React.FormEvent) {
        e.preventDefault();
        if (!editingId) return;
        setIsSubmitting(true);
        try {
            await client.models.Case.update({ id: editingId, nombre, descripcion, estado });
            cancelEdit();
            toast.success("Expediente actualizado.");
            await refresh();
        } catch (e: unknown) {
            toast.error(getErrorMessage(e) || "Error al actualizar el expediente.");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function confirmDelete(id: string) {
        setDeletingId(id);
        try {
            await client.models.Case.delete({ id });
            toast.success("Expediente eliminado.");
            await refresh();
        } catch (e: unknown) {
            toast.error(getErrorMessage(e) || "Error al eliminar el expediente.");
        } finally {
            setDeletingId(null);
            setPendingDeleteId(null);
        }
    }

    function startEdit(c: Case) {
        setEditingId(c.id);
        setNombre(c.nombre);
        setDescripcion(c.descripcion);
        setEstado(c.estado);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function cancelEdit() {
        setEditingId(null);
        setNombre("");
        setDescripcion("");
        setEstado("abierto");
        setShowForm(false);
    }

    const getStatusColor = (estado: string) => {
        switch (estado) {
            case "abierto":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
            case "en_proceso":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
            case "cerrado":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card sticky top-0 z-40">
                <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <ClipboardList className="h-6 w-6" aria-hidden="true" />
                            <span>Mis Expedientes</span>
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">Sesión: {userEmail}</p>
                    </div>
                    <Button
                        onClick={signOut}
                        variant="outline"
                        className="gap-2 bg-transparent cursor-pointer"
                    >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        <span>Cerrar sesión</span>
                    </Button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8">
                {/* Form Section */}
                {showForm && (
                    <Card className="mb-8 border-primary/20 bg-card">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                                {editingId ? (
                                    <>
                                        <Pencil className="h-5 w-5" aria-hidden="true" />
                                        <span>Editar expediente</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-5 w-5" aria-hidden="true" />
                                        <span>Nuevo expediente</span>
                                    </>
                                )}
                            </h2>

                            <form onSubmit={editingId ? onUpdate : onCreate} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground block mb-2">
                                        Nombre del caso
                                    </label>
                                    <Input
                                        placeholder="Ej: Caso vs. Empresa XYZ"
                                        value={nombre}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setNombre(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-foreground block mb-2">
                                        Descripción
                                    </label>
                                    <textarea
                                        placeholder="Detalles del caso..."
                                        value={descripcion}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                            setDescripcion(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-24"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-foreground block mb-2">
                                        Estado
                                    </label>
                                    <select
                                        value={estado}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                            setEstado(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="abierto">{STATUS_LABEL.abierto}</option>
                                        <option value="en_proceso">{STATUS_LABEL.en_proceso}</option>
                                        <option value="cerrado">{STATUS_LABEL.cerrado}</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <Button
                                        type="submit"
                                        className="gap-2 cursor-pointer"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                                                <span>{editingId ? "Guardando…" : "Creando…"}</span>
                                            </>
                                        ) : editingId ? (
                                            <>
                                                <Save className="h-4 w-4" aria-hidden="true" />
                                                <span>Guardar</span>
                                            </>
                                        ) : (
                                            <>
                                                <Check className="h-4 w-4" aria-hidden="true" />
                                                <span>Crear</span>
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={cancelEdit}
                                        className="gap-2 cursor-pointer"
                                        disabled={isSubmitting}
                                    >
                                        <X className="h-4 w-4" aria-hidden="true" />
                                        <span>Cancelar</span>
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Card>
                )}

                {/* Add Button */}
                {!showForm && (
                    <div className="mb-8">
                        <Button
                            type="button"
                            onClick={() => setShowForm(true)}
                            className="gap-2 cursor-pointer"
                        >
                            <Plus className="h-4 w-4" aria-hidden="true" />
                            <span>Nuevo expediente</span>
                        </Button>
                    </div>
                )}

                {/* Cases List */}
                <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Listado de expedientes
                    </h2>

                    {loading ? (
                        <div className="text-center py-12 flex items-center justify-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            <span>Cargando expedientes…</span>
                        </div>
                    ) : items.length === 0 ? (
                        <Card className="text-center py-12 bg-card border-dashed">
                            <p className="text-muted-foreground">
                                Sin expedientes aún. ¡Crea uno para comenzar!
                            </p>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                            <div className="overflow-x-auto rounded-lg border border-border">
                                <table className="w-full text-sm">
                                    <thead className="bg-secondary text-foreground border-b border-border">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                                        <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">
                                            Descripción
                                        </th>
                                        <th className="px-4 py-3 text-center font-semibold">Estado</th>
                                        <th className="px-4 py-3 text-right font-semibold">Acciones</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                    {items.map((c) => (
                                        <tr key={c.id} className="hover:bg-secondary/50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-foreground">
                                                {c.nombre}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell max-w-xs truncate">
                                                {c.descripcion}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                          <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  c.estado
                              )}`}
                          >
                            {STATUS_LABEL[c.estado] ?? c.estado}
                          </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => startEdit(c)}
                                                        className="inline-flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                                        disabled={deletingId === c.id}
                                                    >
                                                        <Pencil className="h-4 w-4" aria-hidden="true" />
                                                        <span>Editar</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPendingDeleteId(c.id)}
                                                        className="inline-flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors bg-destructive/10 text-destructive hover:bg-destructive/20 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                                        disabled={deletingId === c.id}
                                                    >
                                                        {deletingId === c.id ? (
                                                            <>
                                                                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                                                                <span>Eliminando…</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Trash2 className="h-4 w-4" aria-hidden="true" />
                                                                <span>Eliminar</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Confirmación de eliminación */}
            <AlertDialog open={!!pendingDeleteId} onOpenChange={(o) => !o && setPendingDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar expediente?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="cursor-pointer"
                            onClick={() => pendingDeleteId && confirmDelete(pendingDeleteId)}
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
