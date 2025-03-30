import React, { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { Button } from '@/components/ui/button'
import { saveJournalEntry } from './services/googleSheets'
import { getAuthUser, login, logout, User } from './services/auth'

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const { toast } = useToast()
  
  // Define type for saved entries
  interface SavedEntry {
    date: string;
    preview: string;
  }

  // Load saved entries from localStorage
  const getSavedEntries = (): SavedEntry[] => {
    try {
      return JSON.parse(localStorage.getItem('journal_entries') || '[]')
    } catch (e) {
      return []
    }
  }
  
  const [savedEntries, setSavedEntries] = useState<SavedEntry[]>(getSavedEntries())
  
  // Update saved entries when a new entry is added
  const updateSavedEntries = () => {
    setSavedEntries(getSavedEntries())
  }
  
  // Check for existing login on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authUser = getAuthUser()
      setUser(authUser)
      setIsLoading(false)
    }
    
    checkAuth()
  }, [])
  
  // Handle journal submission
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
    
    // Show a confirmation dialog
    if (!window.confirm('Save this journal entry?')) {
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
        // Save submission time to localStorage for reference
        const savedEntries = JSON.parse(localStorage.getItem('journal_entries') || '[]') as SavedEntry[]
        savedEntries.unshift({
          date: new Date().toISOString(),
          preview: content.length > 50 ? content.substring(0, 50) + '...' : content
        })
        // Keep only the 10 most recent entries in localStorage
        if (savedEntries.length > 10) {
          savedEntries.length = 10
        }
        localStorage.setItem('journal_entries', JSON.stringify(savedEntries))
        
        // Update the saved entries state
        updateSavedEntries()
        
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

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    
    if (!username.trim() || !password.trim()) {
      setLoginError('Username and password are required')
      return
    }
    
    try {
      setIsLoading(true)
      const user = await login(username, password)
      setUser(user)
      toast({
        title: "Success!",
        description: `Welcome ${user.username}!`,
      })
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle logout
  const handleLogout = () => {
    logout()
    setUser(null)
    setUsername('')
    setPassword('')
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
  }

  // Render the login form
  const renderLoginForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-16">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      
      {loginError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {loginError}
        </div>
      )}
      
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={isLoading}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={isLoading}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  )
  
  // Render the journal interface
  const renderJournal = () => (
    <>
      {!isFormOpen ? (
        <div className="space-y-6">
          <div className="flex justify-center">
            <Button onClick={() => setIsFormOpen(true)}>
              New Journal Entry
            </Button>
          </div>
          
          {/* Recently saved entries section */}
          {savedEntries.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Recently Saved Entries</h2>
              <p className="text-sm text-gray-500 mb-4">
                These are stored in your browser for reference only. All entries are saved to your Google Sheet.
              </p>
              <div className="space-y-3">
                {savedEntries.map((entry: SavedEntry, index: number) => (
                  <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">{formatDate(entry.date)}</div>
                    <div className="text-gray-700">{entry.preview}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <textarea
            className="w-full p-3 border rounded mb-4 h-48"
            placeholder="What's on your mind today?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Entry'}
            </Button>
          </div>
        </form>
      )}
    </>
  )
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Daily Journal</h1>
          
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm">Welcome, {user.username}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center mt-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
          </div>
        ) : !user ? (
          renderLoginForm()
        ) : (
          renderJournal()
        )}
      </div>
      <Toaster />
    </div>
  )
}

export default App
