import React, { useState } from 'react'
import { useToast } from './components/ui/use-toast'
import { Toaster } from './components/ui/toaster'
import { Button } from './components/ui/button'

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { toast } = useToast()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement Google Sheets integration
    toast({
      title: "Success!",
      description: "Journal entry saved successfully.",
    })
    setIsFormOpen(false)
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
              required
            />
            <div className="flex gap-2">
              <Button type="submit">Save Entry</Button>
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
