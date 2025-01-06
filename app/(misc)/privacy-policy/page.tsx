import { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Privacy Policy | Nicholas Gousis",
  description: "Privacy Policy for Nicholas Gousis's website and newsletter services"
}

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className={`${spaceGrotesk.className} text-4xl font-bold mb-8`}>Privacy Policy</h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-lg mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            This Privacy Policy describes how Nicholas Gousis (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, and shares your personal information when you use our website and services, including our newsletter and any integration with third-party services such as Stripe and LinkedIn.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-semibold mb-3">2.1 Information You Provide</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Contact information (name, email address)</li>
            <li>Payment information (processed securely through Stripe)</li>
            <li>Professional information (when connecting through LinkedIn)</li>
            <li>Newsletter preferences and subscription details</li>
            <li>Communication preferences</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">2.2 Automatically Collected Information</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Device and browser information</li>
            <li>IP address and location data</li>
            <li>Usage data and analytics</li>
            <li>Cookies and similar technologies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6">
            <li>To provide and maintain our services</li>
            <li>To process payments through Stripe</li>
            <li>To send newsletters and communications</li>
            <li>To improve our services and user experience</li>
            <li>To comply with legal obligations</li>
            <li>To protect against fraud and unauthorized access</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6">
            <li>Stripe for payment processing</li>
            <li>LinkedIn for professional networking features</li>
            <li>Service providers and business partners</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights and Choices</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Withdraw consent for data processing</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information, including encryption, secure payment processing through Stripe, and regular security assessments.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Children&apos;s Privacy</h2>
          <p>
            Our services are not intended for children under 13. We do not knowingly collect or maintain information from children under 13.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            Email: privacy@nicholasgousis.com
          </p>
        </section>
      </div>
    </div>
  )
}
