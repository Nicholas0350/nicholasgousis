import { Body, Container, Head, Html, Preview, Section, Text, Button } from "@react-email/components";
import { Unsubscribe } from "./unsubscribe";

interface EmailProps {
  url: string;
  recipientEmail: string;
}

export function Email({ url, recipientEmail }: EmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to our newsletter</Preview>
      <Body style={main}>
        <Container>
          <Section>
            <Text style={text}>Welcome! Please verify your email address.</Text>
            <Button
              href={url}
              style={button}
            >
              Verify Email
            </Button>
            <Text style={text}>
              Or copy and paste this URL into your browser: {url}
            </Text>
            <Unsubscribe email={recipientEmail} />
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
};

const button = {
  backgroundColor: "#000",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "12px",
};

export default Email;
