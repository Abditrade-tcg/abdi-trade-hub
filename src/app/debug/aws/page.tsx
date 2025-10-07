import AWSServiceStatus from '@/components/AWSServiceStatus';

export default function AWSDebugPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AWSServiceStatus />
    </div>
  );
}