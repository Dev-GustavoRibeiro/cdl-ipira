import React from 'react';

interface ErrorStateProps {
  error: string;
}

const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-600">{error}</p>
      </div>
    </div>
  );
};

export default ErrorState;



