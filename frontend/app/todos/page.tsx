import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MaterialIcon from "@/components/MaterialIcon";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase.from("todos").select();

  return (
    <div className="app-page font-sans">
      <Navbar />
      <main className="app-main">
        <div className="page-hero">
          <div className="page-hero-icon">
            <MaterialIcon name="database" size={24} />
          </div>
          <h1 className="page-title">Supabase <span className="page-title-accent">Connection Test</span></h1>
          <p className="page-copy">A small internal page for confirming that Mithra can read from the configured Supabase project.</p>
        </div>

        <section className="section-card max-w-3xl mx-auto">
          <ul className="space-y-3">
            {todos && todos.length > 0 ? (
              todos.map((todo: { id: string | number; name?: string; title?: string }) => (
                <li key={todo.id} className="data-card flex items-center gap-3">
                  <MaterialIcon name="task_alt" size={20} className="text-[var(--blue-600)]" />
                  <span>{todo.name || todo.title || JSON.stringify(todo)}</span>
                </li>
              ))
            ) : (
              <li className="text-[var(--color-text-muted)] flex items-center gap-3">
                <MaterialIcon name="check_circle" size={20} className="text-[var(--color-success)]" filled />
                <span>Connected to Supabase. No items found in the todos table yet.</span>
              </li>
            )}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
