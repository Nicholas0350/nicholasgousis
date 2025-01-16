import { Text, Link } from "@react-email/components";

interface UnsubscribeProps {
  email: string;
  domain?: string;
}

export function Unsubscribe({ email, domain = 'https://nicholasgousis.com' }: UnsubscribeProps) {
  return (
    <Text style={{ fontSize: '12px', color: '#666', marginTop: '24px', textAlign: 'center' as const }}>
      Don&apos;t want to receive these emails?{' '}
      <Link
        href={`${domain}/unsubscribe?email=${email}`}
        style={{ color: '#000', textDecoration: 'underline' }}
      >
        Unsubscribe here
      </Link>
    </Text>
  );
}

export default Unsubscribe;