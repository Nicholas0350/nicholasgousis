import { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Terms of Service | Nicholas Gousis",
  description: "Terms of Service for Nicholas Gousis's website and newsletter services"
}

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className={`${spaceGrotesk.className} text-4xl font-bold mb-8`}>Terms of Service</h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-lg mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing or using the services provided by Nicholas Gousis (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), including our website, newsletter, and any related services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Services</h2>
          <p>We provide:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Newsletter subscription services</li>
            <li>Digital content and resources</li>
            <li>Professional networking features through LinkedIn integration</li>
            <li>Payment processing services through Stripe</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Payment Terms</h2>
          <p>
            All payments are processed securely through Stripe. By making a payment, you agree to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide accurate and complete payment information</li>
            <li>Authorize us to charge your chosen payment method</li>
            <li>Pay all fees and charges incurred through your account</li>
            <li>Keep your payment information updated</li>
          </ul>
          <p>
            Refunds may be issued at our discretion in accordance with our refund policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
          <p>You agree to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
            <li>Not share your account credentials</li>
            <li>Use the services in compliance with applicable laws</li>
            <li>Not engage in unauthorized or fraudulent activities</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property Rights</h2>
          <p>
            All content, including but not limited to text, graphics, logos, and images, is our property or the property of our licensors and is protected by copyright and other intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Third-Party Services</h2>
          <p>Our services integrate with:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Stripe for payment processing - subject to Stripe&apos;s terms of service</li>
            <li>LinkedIn for professional networking - subject to LinkedIn&apos;s terms of service</li>
          </ul>
          <p>
            Your use of these third-party services is subject to their respective terms and conditions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Account Termination</h2>
          <p>
            We reserve the right to terminate or suspend your account and access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which we operate, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms of Service on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us at:
            <br />
            Email: terms@nicholasgousis.com
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Severability</h2>
          <p>
            If any provision of these terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these terms shall otherwise remain in full force and effect and enforceable.
          </p>
        </section>
      </div>
    </div>
  )
}