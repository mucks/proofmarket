import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-neutral-900 to-neutral-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-100 mb-6">
              Proof of{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Execution
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Prediction markets for startup milestones. Bet on delivery. Build credibility. 
              Turn startup progress into transparent, verifiable markets.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/markets">
                <Button size="lg">
                  Explore Markets
                </Button>
              </Link>
              <Link href="/markets/create">
                <Button size="lg" variant="outline">
                  Create Market
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-100">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-neutral-900 p-6 rounded-xl shadow-md border border-neutral-800">
              <div className="w-12 h-12 bg-blue-900/40 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-100">Create Milestones</h3>
              <p className="text-gray-300">
                Founders create prediction markets for their milestones with a stake to show commitment.
              </p>
            </div>

            <div className="bg-neutral-900 p-6 rounded-xl shadow-md border border-neutral-800">
              <div className="w-12 h-12 bg-green-900/40 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-100">Bet YES or NO</h3>
              <p className="text-gray-300">
                Investors and community members bet on whether milestones will be achieved by the deadline.
              </p>
            </div>

            <div className="bg-neutral-900 p-6 rounded-xl shadow-md border border-neutral-800">
              <div className="w-12 h-12 bg-purple-900/40 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-100">Earn Rewards</h3>
              <p className="text-gray-300">
                After resolution, winners claim proportional rewards from the total pool.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-neutral-900 border-y border-neutral-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-400 mb-2">On-Chain</p>
              <p className="text-gray-300">Transparent & Verifiable</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-400 mb-2">BNB Chain</p>
              <p className="text-gray-300">Fast & Low Cost</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-400 mb-2">Fair</p>
              <p className="text-gray-300">Oracle Resolution</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-100">Ready to prove your execution?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Create your first milestone market and show the world you deliver.
          </p>
          <Link href="/markets/create">
            <Button size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
