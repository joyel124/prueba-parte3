import Link from "next/link"

export default function Home() {
    return (
        <main className="min-h-screen bg-linear-to-b from-background to-secondary">
            {/* Header */}
            <header className="border-b border-border bg-card backdrop-blur-sm">
                <div className="mx-auto max-w-6xl px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                                📋
                            </div>
                            <h1 className="text-2xl font-bold text-foreground">Gestión de Expedientes</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="mx-auto max-w-6xl px-6 py-20 md:py-32">
                <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-primary uppercase tracking-wider">Sistema de gestión</p>
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                                Administra tus expedientes con facilidad
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Plataforma segura y eficiente para gestionar todos tus casos, documentos y seguimientos en un solo
                                lugar.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                                href="/cases"
                                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                            >
                                Ir a mis expedientes →
                            </Link>
                            <button className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-secondary transition-colors">
                                Más información
                            </button>
                        </div>
                    </div>

                    {/* Visual placeholder */}
                    <div className="relative hidden md:block">
                        <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-accent/20 rounded-2xl blur-3xl"></div>
                        <div className="relative bg-card border border-border rounded-2xl p-8 shadow-2xl">
                            <div className="space-y-4">
                                <div className="h-4 bg-muted rounded w-32"></div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-muted rounded w-full"></div>
                                    <div className="h-3 bg-muted rounded w-5/6"></div>
                                </div>
                                <div className="pt-4 border-t border-border">
                                    <div className="flex gap-2 py-2">
                                        <div className="h-8 w-16 bg-primary/20 rounded"></div>
                                        <div className="h-8 w-16 bg-primary/10 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="mx-auto max-w-6xl px-6 py-20 border-t border-border">
                <div className="grid gap-8 md:grid-cols-3">
                    {[
                        { icon: "🔒", title: "Seguro", desc: "Autenticación segura con Amplify" },
                        { icon: "📊", title: "Organizado", desc: "Gestión completa de casos y estados" },
                        { icon: "⚡", title: "Rápido", desc: "Interfaz intuitiva y responsiva" },
                    ].map((feature, i) => (
                        <div key={i} className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
                            <div className="text-3xl mb-3">{feature.icon}</div>
                            <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border bg-card mt-20 py-8">
                <div className="mx-auto max-w-6xl px-6 text-center text-sm text-muted-foreground">
                    <p>© 2025 Gestión de Expedientes. Sistema seguro de gestión de casos.</p>
                </div>
            </footer>
        </main>
    )
}