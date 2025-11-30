import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface PasswordChangedEmailProps {
  userName: string;
  timestamp: string;
  ipAddress: string;
}

export const PasswordChangedEmail = ({
  userName,
  timestamp,
  ipAddress,
}: PasswordChangedEmailProps) => (
  <Html>
    <Head />
    <Preview>Your password has been successfully changed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Password Changed</Heading>
        <Text style={text}>
          Hello {userName},
        </Text>
        <Text style={text}>
          Your password for the Wayllis Integrated Cyber Defense Platform has been successfully changed.
        </Text>
        <Section style={infoBox}>
          <Text style={infoText}>
            <strong>Changed at:</strong> {timestamp}
          </Text>
          <Text style={infoText}>
            <strong>IP Address:</strong> {ipAddress}
          </Text>
        </Section>
        <Text style={text}>
          If you did not make this change, please contact your CISO or security administrator immediately.
        </Text>
        <Text style={warningText}>
          ⚠️ Security Notice: Never share your password with anyone. Wayllis staff will never ask for your password.
        </Text>
        <Text style={footer}>
          <Link
            href="https://wayllis.com"
            target="_blank"
            style={{ ...link, color: '#898989' }}
          >
            Wayllis Systems
          </Link>
          <br />
          IT + OT/ICS Unified Security Architecture
        </Text>
      </Container>
    </Body>
  </Html>
);

export default PasswordChangedEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '8px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0 40px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
};

const infoBox = {
  backgroundColor: '#f4f4f4',
  borderRadius: '4px',
  padding: '16px',
  margin: '24px 40px',
};

const infoText = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '8px 0',
};

const warningText = {
  color: '#d97706',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '24px 0',
  padding: '16px 40px',
  backgroundColor: '#fef3c7',
  borderLeft: '4px solid #f59e0b',
};

const link = {
  color: '#2754C5',
  fontSize: '14px',
  textDecoration: 'underline',
};

const footer = {
  color: '#898989',
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '32px',
  padding: '0 40px',
  textAlign: 'center' as const,
};
