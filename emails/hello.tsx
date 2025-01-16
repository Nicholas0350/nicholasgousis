import { Html, Button, Container, Section, Text, Img } from "@react-email/components";
import Unsubscribe from "./unsubscribe";
export default function Hello() {
  return (
    <Html>
      <Container>
        <Section>
          <Text style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
            Master ASIC Compliance & Grow Your Financial Services Business
          </Text>

          <Img
            src="http://localhost:3000/api/chart-image"
            width="600"
            height="300"
            alt="Compliance Performance Metrics"
            style={{
              marginBottom: '20px',
              borderRadius: '8px',
            }}
          />

          <Text style={{ color: '#666', marginBottom: '24px' }}>
            Weekly expert insights on ASIC regulations, risk management, and growth strategies for AFSL & ACL holders.
          </Text>

          <Button
            href="https://example.com"
            style={{
              backgroundColor: "#000",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "5px",
              textDecoration: "none",
            }}
          >
            Subscribe Now
          </Button>

          <Unsubscribe />
        </Section>
      </Container>
    </Html>
  );
}
