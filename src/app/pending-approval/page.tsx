'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import OnboardingLayout from '../onboarding/layout';

export default function PendingApproval() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/dashboard');
  };

  return (
    <OnboardingLayout>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Pending Approval</h1>
        <p>Your organization is currently pending approval. Please check back later or contact support for more information.</p>
        <button
          onClick={handleRedirect}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Dashboard
        </button>
        <Link href="/support" legacyBehavior>
          <a className="text-blue-500 hover:underline mt-4 block">Contact Support</a>
        </Link>
      </div>
    </OnboardingLayout>
  );
}
