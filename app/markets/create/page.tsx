'use client';

import { CreateMarketForm } from '@/components/CreateMarketForm';

export default function CreateMarketPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Create Milestone Market</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Set up a prediction market for your startup milestone and stake BNB to show commitment.
        </p>
      </div>

      <CreateMarketForm />
    </div>
  );
}


