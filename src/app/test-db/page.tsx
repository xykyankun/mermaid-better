'use client';

import { useEffect, useState } from 'react';
import { neonClient } from '@/lib/neon/client';

export default function TestDBPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    testQuery();
  }, []);

  const testQuery = async () => {
    try {
      console.log('Testing templates query...');

      const { data, error: queryError } = await neonClient
        .from('templates')
        .select('*')
        .eq('is_system', true);

      console.log('Query result:', { data, error: queryError });

      if (queryError) {
        setError(queryError);
      } else {
        setResult(data);
      }
    } catch (err: any) {
      console.error('Query exception:', err);
      setError(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Test</h1>

      <div className="mb-4">
        <button
          onClick={testQuery}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Run Query
        </button>
      </div>

      {error && (
        <div className="bg-red-100 p-4 rounded mb-4">
          <h2 className="font-bold">Error:</h2>
          <pre className="text-sm">{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}

      {result && (
        <div className="bg-green-100 p-4 rounded">
          <h2 className="font-bold">Success! Found {result.length} templates:</h2>
          <pre className="text-sm mt-2">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
