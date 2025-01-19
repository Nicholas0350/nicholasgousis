import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import { Unsubscribe } from './unsubscribe';

interface WelcomeEmailProps {
  email: string;
}

export function WelcomeEmail({ email }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Nicholas Gousis Financial Services!</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 py-10 font-sans">
          <Container className="mx-auto mt-[40px] w-[464px]">
            <Section>
              <Heading className="mb-0 text-center text-[24px] font-bold">
                Welcome to Your Financial Services Newsletter
              </Heading>
              <Text className="my-6 text-[16px]">
                Your subscription has been confirmed. Go to your dashboard to get started.
              </Text>
              <Button
                href={`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`}
                className="rounded-md bg-black px-4 py-2 font-medium text-white text-center block w-full"
              >
                Go to Dashboard
              </Button>
            </Section>
            <Section className="mt-8">
              <Unsubscribe email={email} />
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}