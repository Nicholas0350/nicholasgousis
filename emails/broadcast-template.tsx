import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
  Heading,
} from "@react-email/components";

interface BroadcastTemplateProps {
  previewText?: string;
}

const BroadcastTemplate = ({ previewText = "Latest Financial Services Updates" }: BroadcastTemplateProps) => {
  return (
    <Html>
      <Head>
        <title>Nicholas Gousis | Financial Services</title>
        <meta name="description" content={previewText} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container>
          <Section>
            <Heading as="h1" style={heading}>
              Financial Services Newsletter
            </Heading>

            <Text style={text}>
              {'{{content}}'}
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              Don&apos;t want to receive these emails?{' '}
              <Link href="{{unsubscribe}}" style={unsubscribeLink}>
                Unsubscribe here
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
};

const hr = {
  borderColor: "#eaeaea",
  margin: "24px 0",
};

const footer = {
  color: "#666",
  fontSize: "12px",
  textAlign: "center" as const,
};

const unsubscribeLink = {
  color: "#000",
  textDecoration: "underline",
};

export default BroadcastTemplate;