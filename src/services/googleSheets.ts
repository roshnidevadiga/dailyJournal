interface JournalEntry {
  date: string;
  content: string;
}

export async function saveJournalEntry(content: string): Promise<boolean> {
  try {
    if (!content?.trim()) {
      throw new Error('Journal entry content cannot be empty');
    }

    const entry: JournalEntry = {
      date: new Date().toISOString(),
      content: content.trim()
    };

    const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
    
    if (!GOOGLE_SCRIPT_URL) {
      throw new Error('Google Script URL not configured');
    }

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(entry),
    });
    
    // In no-cors mode, we can't read the response
    // but if we get here without throwing, it means the request completed
    return true;


  } catch (error) {
    console.error('Error saving journal entry:', error);
    throw error instanceof Error ? error : new Error('An unexpected error occurred');
  }
}
