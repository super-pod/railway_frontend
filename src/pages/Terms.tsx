import React from 'react';

const Terms = () => {
    return (
        <div className="max-w-4xl mx-auto p-8 text-blue-100">
            <h1 className="text-4xl font-bold mb-8 text-white">Terms of Service</h1>
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-blue-300">1. Acceptance of Terms</h2>
                <p>By accessing or using Orca, you agree to be bound by these Terms of Service.</p>
            </section>
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-blue-300">2. Use of Service</h2>
                <p>You agree to use Orca only for lawful purposes and in a way that does not infringe the rights of others.</p>
            </section>
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-blue-300">3. Calendar Integration</h2>
                <p>By connecting your Google Calendar, you grant Orca read-only access to your calendar events. This access is used solely for the purpose of identifying availability for group scheduling.</p>
            </section>
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-blue-300">4. Account Termination</h2>
                <p>We reserve the right to terminate or suspend your account at our sole discretion, without notice, for conduct that we believe violates these Terms.</p>
            </section>
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-blue-300">5. Limitation of Liability</h2>
                <p>Orca is provided "as is". We are not liable for any damages arising out of your use of the service.</p>
            </section>
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-blue-300">6. Contact</h2>
                <p>For any questions regarding these terms, please contact us at <a href="mailto:pod@getorca.in" className="text-blue-400 hover:underline">pod@getorca.in</a>.</p>
            </section>
        </div>
    );
};

export default Terms;
