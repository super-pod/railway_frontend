import React from 'react';

const Privacy = () => {
    return (
        <div className="max-w-4xl mx-auto p-8 text-blue-100">
            <h1 className="text-4xl font-bold mb-8 text-white">Privacy Policy</h1>
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-blue-300">1. Introduction</h2>
                <p>Welcome to Orca. We value your privacy and are committed to protecting your personal data.</p>
            </section>
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-blue-300">2. Data We Collect</h2>
                <p>We collect information you provide directly to us, such as your name and email when you sign in with Google.</p>
                <p className="mt-4"><strong>Calendar Data:</strong> If you choose to sync your Google Calendar, we access your calendar events in read-only mode to find optimal meeting times for your pods. We do not store your private event details long-term; we only pull them live during scheduling discussions.</p>
            </section>
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-blue-300">3. How We Use Data</h2>
                <p>We use your data to:</p>
                <ul className="list-disc ml-6 mt-2 space-y-2">
                    <li>Provide and maintain the Orca service.</li>
                    <li>Synchronize availability within your "pods" to facilitate scheduling.</li>
                    <li>Improve our service based on usage patterns.</li>
                </ul>
            </section>
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-blue-300">4. Data Security</h2>
                <p>We implement industry-standard security measures to protect your data. Your Google access tokens are encrypted and stored securely.</p>
            </section>
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-blue-300">5. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:pod@getorca.in" className="text-blue-400 hover:underline">pod@getorca.in</a>.</p>
            </section>
        </div>
    );
};

export default Privacy;
