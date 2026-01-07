'use client';
import { useState, useEffect } from 'react';
import { updateNote, deleteNote } from '@/lib/actions';

export default function NoteItem({ note }: { note: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (note.createdAt) {
      setFormattedDate(new Date(note.createdAt).toLocaleString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
      }));
    }
  }, [note.createdAt]);

  const glowColor = note.color || '#f97316';

  if (isEditing) {
    return (
      <form action={async (f) => { await updateNote(note._id, f); setIsEditing(false); }} 
            className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border-2 border-gray-900 dark:border-white shadow-2xl transition-all">
        <input name="title" defaultValue={note.title} className="w-full bg-transparent font-black text-xl mb-2 outline-none tracking-tight" />
        <textarea name="content" defaultValue={note.content} className="w-full bg-transparent h-32 outline-none resize-none text-md leading-relaxed" />
        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-gray-950 text-white dark:bg-white dark:text-gray-900 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Update</button>
          <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-100 dark:bg-gray-800 px-5 py-2 rounded-xl text-[10px] font-bold">Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-white/90 dark:bg-gray-900/95 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex flex-col justify-between transition-all duration-500 ease-out cursor-default"
      style={{ 
        // Reduced height/size feel through padding (p-6)
        // Transformation: Lift up 6px on hover
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? `0 20px 40px -12px ${glowColor}50, 0 0 0 1px ${glowColor}20` 
          : `0 10px 20px -10px ${glowColor}30`,
      }}
    >
      <div className="absolute top-5 right-6">
        <div 
          className="w-2 h-2 rounded-full transition-all duration-500" 
          style={{ 
            backgroundColor: glowColor,
            boxShadow: isHovered ? `0 0 10px ${glowColor}` : 'none'
          }} 
        />
      </div>

      <div>
        <h3 
          className="font-black text-xl mb-3 tracking-tighter transition-all duration-300" 
          style={{ color: glowColor }}
        >
          {note.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-4">
          {note.content}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center">
        <span 
          className="text-[9px] font-black uppercase tracking-[0.2em] transition-opacity duration-300" 
          style={{ color: glowColor, opacity: isHovered ? 1 : 0.6 }}
        >
          {formattedDate || "..."}
        </span>
        
        <div className="flex gap-1.5">
          <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" 
                 stroke={glowColor} strokeWidth="3">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button onClick={() => deleteNote(note._id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors text-gray-300 hover:text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}