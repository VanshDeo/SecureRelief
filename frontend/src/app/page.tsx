'use client';

import React from 'react';
import Layout from '@/components/Layout/Layout';
import HomePage from '@/components/Home/HomePage';

export default function Page() {
  return (
    <Layout fullWidth={true}>
      <HomePage />
    </Layout>
  );
}
