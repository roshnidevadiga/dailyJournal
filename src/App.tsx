import React, { useState } from 'react'
import { useToast } from './components/ui/use-toast'
import { Toaster } from './components/ui/toaster'
import { Button } from './components/ui/button'
import { saveJournalEntry } from './services/googleSheets'

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content for your journal entry.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const success = await saveJournalEntry(content)
      if (success) {
        toast({
          title: "Success!",
          description: "Journal entry saved successfully.",
        })
        setContent('')
        setIsFormOpen(false)
      }
    } catch (error) {
      // Only show error toast for actual errors, not redirects
      if (error instanceof Error && error.message !== 'Failed to fetch') {
        toast({
          title: "Error",
          description: "Failed to save journal entry. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Daily Journal</h1>
        
        {!isFormOpen ? (
          <Button onClick={() => setIsFormOpen(true)}>
            New Journal Entry
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <textarea
              className="w-full h-48 p-4 border rounded-md mb-4"
              placeholder="Write your journal entry here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Entry'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
      <Toaster />
    </div>
  )
}

export default App
