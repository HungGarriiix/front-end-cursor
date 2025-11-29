import { createFileRoute, Link } from '@tanstack/react-router'
import { TrendingUp, Calendar, MessageSquare, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-primary">FinanceFlow</div>
        <Link to="/login">
          <Button variant="outline">Sign In</Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold text-balance text-foreground">
              Manage Your Finances with Intelligence
            </h1>
            <p className="text-xl text-muted-foreground text-balance">
              Track your balance, monitor transactions in real-time, and get
              AI-powered insights to make smarter financial decisions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-transparent"
            >
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="space-y-2">
              <p className="text-3xl font-bold text-primary">100K+</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-accent">$50B+</p>
              <p className="text-sm text-muted-foreground">Tracked</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-primary">24/7</p>
              <p className="text-sm text-muted-foreground">Support</p>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground">
              Real-Time Balance
            </h3>
            <p className="text-muted-foreground">
              Stay updated with your current balance and recent transactions
              instantly.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground">
              Transaction History
            </h3>
            <p className="text-muted-foreground">
              View your full calendar of payments and purchases in one place.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground">
              AI Chatbot
            </h3>
            <p className="text-muted-foreground">
              Get intelligent financial advice and answers from our AI
              assistant.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 FinanceFrend. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
