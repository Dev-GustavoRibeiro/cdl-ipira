import ConditionalLayout from '../components/ConditionalLayout';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConditionalLayout>{children}</ConditionalLayout>;
}
