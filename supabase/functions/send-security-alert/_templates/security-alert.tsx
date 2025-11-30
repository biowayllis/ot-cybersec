import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface SecurityAlertEmailProps {
  userName: string;
  alertType: string;
  alertDetails: string;
  timestamp: string;
  ipAddress: string;
  location?: string;
}

export const SecurityAlertEmail = ({
  userName,
  alertType,
  alertDetails,
  timestamp,
  ipAddress,
  location,
}: SecurityAlertEmailProps) => (
  <Html>
    <Head />
    <Preview>Security Alert - Suspicious activity detected on your account</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🔒 Security Alert</Heading>
        
        <Text style={text}>
          Hi {userName},
        </Text>
        
        <Text style={text}>
          We detected suspicious activity on your Wayllis account and wanted to alert you immediately.
        </Text>

        <Section style={alertBox}>
          <Heading style={h2}>{alertType}</Heading>
          <Text style={alertText}>{alertDetails}</Text>
        </Section>

        <Section style={detailsSection}>
          <Text style={detailLabel}>Time:</Text>
          <Text style={detailValue}>{timestamp}</Text>
          
          <Text style={detailLabel}>IP Address:</Text>
          <Text style={detailValue}>{ipAddress}</Text>
          
          {location && (
            <>
              <Text style={detailLabel}>Location:</Text>
              <Text style={detailValue}>{location}</Text>
            </>
          )}
        </Section>

        <Hr style={hr} />

        <Section style={actionSection}>
          <Heading style={h3}>What should you do?</Heading>
          <Text style={text}>
            If this was you, you can safely ignore this email.
          </Text>
          <Text style={text}>
            If you don't recognize this activity:
          </Text>
          <Text style={bulletList}>
            • Change your password immediately<br />
            • Enable two-factor authentication (2FA) if not already enabled<br />
            • Review your recent account activity<br />
            • Contact your security team if needed
          </Text>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          This is an automated security alert from Wayllis Integrated Cyber Defense Platform.
          If you have questions, please contact your security administrator.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default SecurityAlertEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 20px 20px',
  padding: '0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#dc2626',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 10px',
};

const h3 = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 10px',
};

const text = {
  color: '#404040',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 20px',
};

const alertBox = {
  backgroundColor: '#fef2f2',
  border: '2px solid #dc2626',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px',
};

const alertText = {
  color: '#404040',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
};

const detailsSection = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px',
};

const detailLabel = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '8px 0 4px',
};

const detailValue = {
  color: '#1a1a1a',
  fontSize: '16px',
  margin: '0 0 16px',
  fontFamily: 'monospace',
};

const actionSection = {
  margin: '20px',
};

const bulletList = {
  color: '#404040',
  fontSize: '16px',
  lineHeight: '28px',
  margin: '16px 20px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '20px',
  textAlign: 'center' as const,
};