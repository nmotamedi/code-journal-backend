import { json } from "react-router-dom";

export type Entry = {
  entryId?: number;
  title: string;
  notes: string;
  photoUrl: string;
};

type Data = {
  entries: Entry[];
  nextEntryId: number;
};

export async function readEntries(): Promise<Entry[]> {
  const resp = await fetch(`/api/entries`);
  if (!resp.ok) throw new Error(`Fetch Error`);
  const entriesList = await resp.json();
  return entriesList;
}

export async function readEntry(entryId: number): Promise<Entry | undefined> {
  const resp = await fetch(`/api/entries/${entryId}`);
  if (!resp.ok) throw new Error(`Fetch Error`);
  const entry = await resp.json();
  return entry;
}

export async function addEntry(entry: Entry): Promise<Entry> {
  const options = {
    method: 'POST',
    body: JSON.stringify(entry),
    headers: {'Content-Type': 'application/json'}
  }
  const resp = await fetch('/api/entries', options);
  if(!resp.ok) throw new Error (`Fetch error with status ${resp.status}`)
  const newEntry = await resp.json();
  return newEntry;
}

export async function updateEntry(entry: Entry): Promise<Entry> {
  const options = {
    method: 'PUT',
    body: JSON.stringify(entry),
    headers: { 'Content-Type': 'application/json' },
  };
  const resp = await fetch(`/api/entries/${entry.entryId}`, options);
  if (!resp.ok) throw new Error(`Fetch error with status ${resp.status}`);
  const updatedEntry = await resp.json();
  return updatedEntry;
}

export async function removeEntry(entryId: number): Promise<void> {
  const data = readData();
  const updatedArray = data.entries.filter(
    (entry) => entry.entryId !== entryId
  );
  data.entries = updatedArray;
  writeData(data);
}
