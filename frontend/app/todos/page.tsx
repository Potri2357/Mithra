import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase.from("todos").select();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <ul className="space-y-2">
        {todos && todos.length > 0 ? (
          todos.map((todo: { id: string | number; name?: string; title?: string }) => (
            <li key={todo.id} className="p-3 bg-slate-900 rounded border border-slate-800">
              {todo.name || todo.title || JSON.stringify(todo)}
            </li>
          ))
        ) : (
          <li className="text-slate-400">
            Connected to Supabase! No items found in &apos;todos&apos; table yet.
          </li>
        )}
      </ul>
    </div>
  );
}
