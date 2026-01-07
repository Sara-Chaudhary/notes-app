'use server';

import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

export async function createNote(formData: FormData) {
  const client = await clientPromise;
  const db = client.db("note_db");
  const colors = ['#f97316', '#fb7185', '#f59e0b', '#ef4444', '#a855f7', '#0ea5e9'];

  const lastNote = await db.collection("notes").find({}).sort({ createdAt: -1 }).limit(1).toArray();
  const lastIndex = lastNote.length > 0 ? colors.indexOf(lastNote[0].color) : -1;
  const nextColor = colors[(lastIndex + 1) % colors.length];

  await db.collection("notes").insertOne({
    title: formData.get('title'),
    content: formData.get('content'),
    color: nextColor,
    createdAt: new Date(),
  });

  revalidatePath('/');
}

export async function updateNote(id: string, formData: FormData) {
  const client = await clientPromise;
  const db = client.db("note_db");
  await db.collection("notes").updateOne(
    { _id: new ObjectId(id) },
    { $set: { title: formData.get('title'), content: formData.get('content') } }
  );
  revalidatePath('/');
}

export async function deleteNote(id: string) {
  const client = await clientPromise;
  const db = client.db("note_db");
  await db.collection("notes").deleteOne({ _id: new ObjectId(id) });
  revalidatePath('/');
}