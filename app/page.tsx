import clientPromise from '@/lib/mongodb';
import { createNote } from '@/lib/actions';
import NoteItem from '@/components/NoteItem';

export default async function Home() {
  const client = await clientPromise;
  const db = client.db("note_db");
  const rawNotes = await db.collection("notes").find({}).sort({ createdAt: -1 }).toArray();
  const notes = rawNotes.map(note => ({ ...note, _id: note._id.toString() }));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
      <main className="max-w-full mx-auto lg:grid lg:grid-cols-5 min-h-screen relative">
        
        {/* LEFT SIDE (40%): lg:col-span-2 */}
        <aside className="lg:col-span-2 p-8 lg:p-12 lg:sticky lg:top-0 lg:h-screen flex flex-col border-r border-gray-100 dark:border-gray-900 bg-white/50 dark:bg-gray-950/50 backdrop-blur-2xl z-10">
          
          {/* HEADER PINNED TO TOP */}
          <header className="text-center pt-4">
            <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              QuickNotes
            </h1>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em] mt-3">
              Sunset Edition
            </p>
          </header>

          {/* FORM CENTERED IN THE REMAINING SPACE */}
          <div className="flex-grow flex flex-col items-center justify-center">
            <section className="relative group w-full max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-rose-500 to-amber-400 rounded-[3.1rem] blur-2xl opacity-0 group-hover:opacity-20 transition duration-700"></div>
              
              <form 
                action={createNote} 
                className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-[3rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(249,115,22,0.15)]"
              >
                <input 
                  name="title" 
                  placeholder="What's the big idea?" 
                  className="w-full text-3xl font-black bg-transparent outline-none tracking-tight placeholder:bg-gradient-to-r placeholder:from-orange-300 placeholder:to-rose-400 placeholder:bg-clip-text placeholder:text-transparent focus:placeholder:text-gray-100 mb-4 text-center" 
                  required 
                />
                <textarea 
                  name="content" 
                  placeholder="Start typing..." 
                  className="w-full min-h-[180px] bg-transparent outline-none resize-none text-lg leading-relaxed text-gray-600 dark:text-gray-300 placeholder:text-gray-200 text-center" 
                  required 
                />
                
                <div className="flex flex-col items-center gap-6 pt-6 border-t border-gray-50 dark:border-gray-800 mt-6">
                  <div className="flex gap-1.5">
                     <div className="w-2 h-2 rounded-full bg-orange-500/20" />
                     <div className="w-2 h-2 rounded-full bg-rose-500/20" />
                     <div className="w-2 h-2 rounded-full bg-amber-500/20" />
                  </div>
                  <button 
                    type="submit" 
                    className="bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 text-white font-black px-10 py-3.5 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-[0_20px_40px_-10px_rgba(244,63,94,0.4)] uppercase text-xs tracking-widest w-full"
                  >
                    Save Note
                  </button>
                </div>
              </form>
            </section>
          </div>
        </aside>

        {/* RIGHT SIDE (60%): lg:col-span-3 */}
        <section className="lg:col-span-3 p-8 lg:p-12 bg-gray-50/40 dark:bg-gray-900/20 backdrop-blur-xl min-h-screen">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {notes.map((note) => (
              <NoteItem key={note._id} note={note} />
            ))}
          </div>
          
          {notes.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <p className="text-gray-300 font-bold uppercase text-[10px] tracking-widest">Awaiting thoughts...</p>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}