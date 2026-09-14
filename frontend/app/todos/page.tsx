import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Database, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase.from("todos").select();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-[#024DA1] dark:text-blue-400 flex items-center justify-center mx-auto">
            <Database className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Supabase <span className="text-[#024DA1] dark:text-blue-400">Connection Test</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A small internal page for confirming that Mithra can read from the configured Supabase project.
          </p>
        </div>

        <Card className="p-6">
          <ul className="space-y-3">
            {todos && todos.length > 0 ? (
              todos.map((todo: { id: string | number; name?: string; title?: string }) => (
                <li key={todo.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#024DA1]" />
                  <span>{todo.name || todo.title || JSON.stringify(todo)}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500 dark:text-slate-400 flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Connected to Supabase. No items found in the todos table yet.</span>
              </li>
            )}
          </ul>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
