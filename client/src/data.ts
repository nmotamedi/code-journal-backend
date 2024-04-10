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
  const data = readData();
  const newEntry = {
    ...entry,
    entryId: data.nextEntryId++,
  };
  data.entries.unshift(newEntry);
  writeData(data);
  return newEntry;
}

export async function updateEntry(entry: Entry): Promise<Entry> {
  const data = readData();
  const newEntries = data.entries.map((e) =>
    e.entryId === entry.entryId ? entry : e
  );
  data.entries = newEntries;
  writeData(data);
  return entry;
}

export async function removeEntry(entryId: number): Promise<void> {
  const data = readData();
  const updatedArray = data.entries.filter(
    (entry) => entry.entryId !== entryId
  );
  data.entries = updatedArray;
  writeData(data);
}
