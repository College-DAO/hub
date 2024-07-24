import React from 'react';
import Link from 'next/link';
import OnboardingLayout from '../onboarding/layout';

export default function PendingApproval() {
  return (
    <OnboardingLayout>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Pending Approval</h1>
        <p>Your organization is currently pending approval. Please check back later or contact support for more information.</p>
        <Link href="/support" legacyBehavior>
          <a className="text-blue-500 hover:underline">Contact Support</a>
        </Link>
      </div>
    </OnboardingLayout>
  );
}
