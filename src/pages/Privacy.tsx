import React from 'react';

const Privacy = () => (
    <div className="min-h-screen bg-[#f4f8f7] px-6 py-12">
        <div className="mx-auto max-w-3xl space-y-5 rounded-2xl border border-[#0a4f56]/12 bg-white p-6 text-sm text-[#33585d]">
            <h1 className="mb-4 text-2xl font-semibold text-[#09343a]">Privacy Policy</h1>
            
            <p className="text-xs text-[#5a7a7f]">Last updated: February 2026</p>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-[#09343a]">Google Data We Access</h2>
                <p>
                    When you connect Google Calendar, Orca accesses calendar event data needed for scheduling, including event time ranges and optional metadata
                    such as title, location, and attendee information. We only request the minimum permissions necessary to provide our scheduling features.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-[#09343a]">How We Use Google User Data</h2>
                <p>
                    Orca uses Google Calendar data only to provide and improve user-facing scheduling features such as availability checks, time-slot ranking, and
                    meeting creation. We do not use this data for any other purpose.
                </p>
                <p>
                    Orca does not sell, rent, or share Google user data with third parties. Data is used solely for providing and improving Orca's functionality. We do not use Google user data for serving advertisements.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-[#09343a]">Data Sharing and Transfers</h2>
                <p>
                    We do not sell, share, or transfer your Google user data to third parties.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-[#09343a]">Data Storage and Retention</h2>
                <p>
                    We store Google Calendar data only as long as necessary to provide our scheduling services. Access tokens and calendar data are retained while your account is active and for a limited period after disconnection to facilitate potential reconnection.
                </p>
                <p>
                    You can disconnect Google Calendar from Orca at any time through the Calendar page in your account settings. Disconnecting immediately revokes stored tokens and stops further Google Calendar access.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-[#09343a]">Your Rights and Controls</h2>
                <p>
                    You have the following rights regarding your data:
                </p>
                <ul className="ml-5 list-disc space-y-1">
                    <li>Access and export your data at any time through your account settings</li>
                    <li>Disconnect Google Calendar authorization from Orca settings or your Google account permissions page</li>
                    <li>Request deletion of your account and all associated data</li>
                </ul>
                <p>
                    To request account and data deletion, contact <a className="underline underline-offset-2" href="mailto:contact@getorca.in">contact@getorca.in</a>. We will process deletion requests within 30 days.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-[#09343a]">Security Measures</h2>
                <p>
                    Orca implements industry-standard administrative, technical, and physical safeguards to protect user data both in transit and at rest. This includes encryption, access controls, and regular security assessments.
                </p>
                <p>
                    However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-[#09343a]">Children's Privacy</h2>
                <p>
                    Orca is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children under 13.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-[#09343a]">Changes to This Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page and updating the "Last updated" date.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-[#09343a]">Contact Us</h2>
                <p>
                    For questions about this Privacy Policy or our data practices, contact <a className="underline underline-offset-2" href="mailto:contact@getorca.in">contact@getorca.in</a>.
                </p>
            </section>
        </div>
    </div>
);

export default Privacy;
