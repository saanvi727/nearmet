import { useState } from 'react'
import { signIn } from '../lib/supabase'

function NearMetLogo({ size = 28 }) {
  const height = Math.round(size * 1.8);
  return <img src="/logo.png" alt="NearMet" style={{ height, width: "auto", objectFit: "contain", display: "block", maxWidth: size * 7 }} />;
}

// ── Decorative bits for the landing hero ──────────────────────────────────────
function Sparkle({ size = 16, color = "#581073", style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
      <path d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z" />
    </svg>
  );
}
function CloudShape({ width = 70, style }) {
  return (
    <svg width={width} height={width * 0.55} viewBox="0 0 100 55" style={style}>
      <ellipse cx="30" cy="35" rx="26" ry="18" fill="#EDE1F4" />
      <ellipse cx="55" cy="24" rx="23" ry="20" fill="#EDE1F4" />
      <ellipse cx="76" cy="35" rx="20" ry="16" fill="#EDE1F4" />
    </svg>
  );
}
function MoonShape({ size = 40, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={style}>
      <path d="M26 4a16 16 0 1 0 0 32 12.5 12.5 0 0 1 0-32Z" fill="#D9C4EC" />
    </svg>
  );
}
function Dot({ size = 6, color = "#C9A8E8", style }) {
  return <div style={{ width: size, height: size, borderRadius: "50%", background: color, position: "absolute", ...style }} />;
}
function WavyDivider() {
  return (
    <svg width="220" height="20" viewBox="0 0 220 20" style={{ display: "block", margin: "0 auto" }}>
      <path d="M0 10 Q 27.5 -3 55 10 T 110 10 T 165 10 T 220 10" stroke="#C9A8E8" strokeWidth="2" strokeDasharray="4 7" fill="none" strokeLinecap="round" />
    </svg>
  );
}
function CityIllustration() {
  return (
    <svg viewBox="0 0 400 138" style={{ width: "100%", height: "auto", display: "block" }}>
      <line x1="0" y1="130" x2="400" y2="130" stroke="#E4D4F0" strokeWidth="2" />
      <g fill="#E4D4F0">
        <rect x="10" y="62" width="32" height="68" rx="1.5" />
        <rect x="48" y="82" width="26" height="48" rx="1.5" />
        <rect x="80" y="34" width="36" height="96" rx="1.5" />
        <rect x="122" y="72" width="24" height="58" rx="1.5" />
        <rect x="152" y="18" width="34" height="112" rx="1.5" />
        <rect x="167.4" y="2" width="2.5" height="16" />
        <rect x="192" y="56" width="28" height="74" rx="1.5" />
        <rect x="226" y="40" width="40" height="90" rx="1.5" />
        <rect x="272" y="76" width="26" height="54" rx="1.5" />
        <rect x="304" y="30" width="32" height="100" rx="1.5" />
        <rect x="342" y="68" width="24" height="62" rx="1.5" />
        <rect x="372" y="86" width="20" height="44" rx="1.5" />
      </g>
    </svg>
  );
}
function SignpostIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
      <rect x="18" y="6" width="4" height="30" rx="1" fill="#581073" />
      <rect x="8" y="10" width="16" height="7" rx="1.5" fill="#7D2A9E" />
      <rect x="16" y="18" width="16" height="7" rx="1.5" fill="#581073" />
      <circle cx="12" cy="34" r="4" fill="#FF9A8B" opacity="0.55" />
      <circle cx="27" cy="35" r="3" fill="#FF9A8B" opacity="0.45" />
    </svg>
  );
}
function RamenIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
      <path d="M6 18h28l-3 10a11 11 0 0 1-22 0Z" fill="#581073" />
      <path d="M10 18c2-4 6-6 10-6s8 2 10 6" stroke="#FF9A8B" strokeWidth="2" fill="none" strokeLinecap="round" />
      <line x1="24" y1="6" x2="30" y2="16" stroke="#7D2A9E" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="29" y1="5" x2="35" y2="15" stroke="#7D2A9E" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
      <rect x="6" y="10" width="28" height="24" rx="4" fill="#581073" />
      <rect x="6" y="10" width="28" height="7" rx="4" fill="#7D2A9E" />
      <rect x="12" y="4" width="3" height="8" rx="1.5" fill="#7D2A9E" />
      <rect x="25" y="4" width="3" height="8" rx="1.5" fill="#7D2A9E" />
      <path d="M20 20l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6Z" fill="#FF9A8B" />
    </svg>
  );
}

const FEATURES = [
  { Icon: SignpostIcon, text: "Discover places worth exploring" },
  { Icon: RamenIcon, text: "Explore food spots and share your discoveries" },
  { Icon: CalendarIcon, text: "Create events and build memories" },
];

export default function AuthPage({ onBack, mode: props_mode, onCreateAccount, onForgotPassword }) {
  const [mode, setMode] = useState(props_mode || 'landing')
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [termsDoc, setTermsDoc] = useState('terms') // 'terms' | 'privacy'
  const [signedUpEmail, setSignedUpEmail] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSignIn(e) {
    e.preventDefault()
    setLoading(true); setError('')
    try { await signIn({ email: form.email, password: form.password }) }
    catch (err) { setError(err.message || 'Sign in failed. Check your email and password.') }
    finally { setLoading(false) }
  }

  const TERMS_TEXT = `NearMet is currently an independently operated beta platform under active development. This document describes how the Platform operates during this stage and is intended to provide transparency about your rights and responsibilities while using NearMet. As the Platform evolves or becomes operated by a registered legal entity this document may be updated accordingly.

1. Introduction
Welcome to NearMet.
NearMet is a prototype online platform designed to help people discover like-minded individuals, share meaningful recommendations, explore their city and create real-world experiences together.
Unlike traditional social media platforms, NearMet is built around authentic connections through shared interests, experiences, recommendations and activities.
These Terms of Service ("Terms") govern your access to and use of the NearMet website, applications, products and services (collectively the "Platform").
By creating an account, accessing or using NearMet, you agree to be bound by these Terms.
If you do not agree with these Terms, you must not use the Platform.

2. Prototype Status
NearMet is currently operating as an independent prototype (beta) platform.
The Platform is being actively developed, tested and improved before any formal commercial launch.
Because of this, features may change without notice; new features may be introduced; existing features may be modified or removed; the Platform may occasionally become unavailable; bugs, errors, or unexpected behavior may occur.
By using NearMet, you acknowledge that you are participating in an early-stage product.
Your feedback may be used to improve the Platform.

3. About NearMet
NearMet helps people discover meaningful real-world connections through shared interests, recommendations and experiences.
Depending on available features users may: create a personal profile; upload profile photographs; share the things they enjoy; share things they want to experience; answer thought prompts; recommend food spots; recommend places worth exploring; discover recommendations shared by the community; create experiences; join experiences; communicate with other users; report inappropriate behavior; discover people with similar interests.
NearMet is intended to encourage genuine, respectful and meaningful interactions.

4. Definitions
Throughout these Terms:
"NearMet", "we", "our" or "us" refers to the NearMet platform and its operator.
"Platform" means the NearMet website and any related applications or services.
"User", "you" or "your" means anyone who accesses or uses the Platform.
"Profile" means the personal information, photographs, recommendations, interests, thoughts and other content shared by a user.
"Content" includes text, photographs, recommendations, experiences, comments, profile information and any other information submitted to the Platform.
"Shared Experience" means a recommendation shared by a user about a food spot or place worth exploring.
"Experience" means an activity, meetup, event or gathering created by a user through the Platform.

5. Eligibility
To use NearMet, you must: satisfy the minimum age required by applicable law in your jurisdiction; have the legal capacity to agree to these Terms; provide accurate information when creating an account; use the Platform only for lawful purposes.
You agree that the information you provide is accurate and kept reasonably up to date.
You may not create an account using false information or impersonate another person.

6. User Accounts
To access certain features, you may need to create an account.
You are responsible for: maintaining the confidentiality of your login credentials; all activity that occurs through your account; ensuring that your information remains accurate.
If you believe your account has been accessed without authorization you should notify NearMet as soon as reasonably possible.
NearMet may suspend or terminate accounts that violate these Terms or pose a risk to the Platform or its users.

7. Your Profile
NearMet encourages users to create authentic profiles.
Your profile may include features such as: profile photographs; basic information; What I Enjoy; Things I Want to Experience; Thoughts; Food Spots; Places Worth Exploring; other profile information introduced in future updates.
You are responsible for ensuring that information shared in your profile is accurate and does not violate these Terms.
You should only upload photographs that you have the right to use.

8. Community Standards
NearMet exists to encourage respectful and genuine interactions.
When using the Platform, you agree not to: harass, threaten, intimidate or abuse others; discriminate based on race, religion, nationality, disability, gender, sexual orientation or other protected characteristics; impersonate another person; create fake accounts; upload unlawful content; share sexually explicit material; encourage violence; promote illegal activities; upload malware or malicious software; spam users; attempt to manipulate recommendations or experiences; use automated tools to scrape or harvest data without permission.
Repeated or serious violations may result in suspension or permanent removal of your account.

9. Authenticity
NearMet is built around genuine experiences.
Accordingly, you agree to: recommend only places you have personally visited; share honest opinions; avoid promotional or misleading recommendations; avoid posting fabricated experiences; avoid posting content solely intended to advertise products or businesses without permission.
NearMet may remove content that appears misleading, fraudulent, promotional or inconsistent with the purpose of the Platform.

10. Respectful Offline Interactions
NearMet helps people discover opportunities to connect in the real world.
However, NearMet cannot supervise or control interactions that take place outside the Platform.
Users are responsible for exercising their own judgment before: meeting another user; attending an experience; participating in an activity; visiting a recommended location.
Whenever possible, users are encouraged to: meet in public places; inform someone they trust; exercise reasonable caution.
NearMet does not guarantee the conduct, identity, intentions or safety of any user.

11. User Content
NearMet allows users to create and share content including but not limited to: profile information; profile photographs; food spot recommendations; places worth exploring; shared experiences; experiences (events); comments, messages, feedback, and other content introduced in future updates.
You remain the owner of the content you create and share.
However, by uploading or submitting content to NearMet, you grant NearMet a worldwide, non-exclusive, royalty-free license to: host your content; store your content; display your content; reproduce your content where reasonably necessary; distribute your content within the Platform; improve and operate the Platform.
This license exists solely for operating and improving NearMet.
It does not transfer ownership of your content to NearMet.

12. Your Responsibility for Content
You are solely responsible for everything you upload or share.
You agree that your content will: be truthful; not violate applicable law; not infringe another person's intellectual property rights; not invade another person's privacy; not contain malicious software; not contain false or misleading recommendations; not contain defamatory or abusive material.
NearMet does not guarantee the accuracy of user-generated content.
Users should exercise their own judgment when relying on recommendations or information shared by others.

13. Food Spots & Places Worth Exploring
NearMet allows users to recommend places they genuinely enjoyed.
Recommendations should reflect genuine personal experiences.
Users should only recommend places they have personally visited.
Users should not: submit fake recommendations; submit paid promotions without disclosure; intentionally mislead others; upload copyrighted photographs they do not own; impersonate another reviewer.
Business names, locations, opening hours, menus, prices, facilities and other details may change over time.
NearMet does not guarantee that information about any place will remain accurate or up to date.
Users are encouraged to verify important details independently before visiting a location.

14. Shared Experiences
Shared Experiences are intended to help the community discover meaningful places through genuine recommendations.
NearMet encourages authenticity over popularity.
Recommendations should represent personal experiences rather than advertisements.
NearMet reserves the right to remove Shared Experiences that: appear misleading; contain spam; are primarily promotional; encourage illegal activity; violate these Terms; negatively impact the integrity of the Platform.
NearMet does not verify every recommendation before publication.

15. Experiences (Events)
NearMet allows users to create and participate in experiences.
Examples include but are not limited to: sports activities; coffee meetups; food outings; workshops; movie outings; volunteer activities; educational sessions; exploration activities; other community experiences.
NearMet only provides the Platform through which organizers and participants may connect.
NearMet does not organize, supervise, endorse or control user-created experiences.
Organizers are solely responsible for: planning their experience; communicating accurate information; complying with applicable laws; ensuring the safety of participants where reasonably possible.
Participants are solely responsible for deciding whether to attend an experience.

16. Offline Meetings
Interactions arranged through NearMet occur solely at the users' discretion.
NearMet cannot guarantee: the identity of another user; the intentions of another user; the quality of an experience; the safety of any meeting.
Users should always exercise reasonable judgment.
NearMet strongly recommends: meeting in public places; informing a trusted person; arranging transportation responsibly; leaving immediately if a situation feels unsafe.
Users assume responsibility for their decisions regarding offline interactions.

17. Reporting Content
Users are encouraged to help maintain a respectful community.
If you believe content or behavior violates these Terms, you may report it through the Platform.
Reports may include: fake profiles; harassment; abusive conduct; spam; misleading recommendations; inappropriate photographs; copyright violations; unsafe experiences; unlawful activity.
Submitting intentionally false reports may itself constitute misuse of the Platform.

18. Moderation
NearMet may review content reported by users or identified through automated systems.
NearMet may, without prior notice: remove content; restrict visibility of content; suspend accounts; permanently remove accounts; limit certain Platform features; investigate suspected misuse.
NearMet is not obligated to remove every reported item but reserves discretion to protect the integrity and safety of the Platform.

19. Intellectual Property
Unless otherwise stated, all intellectual property associated with NearMet remains the property of its creator and operator.
This includes, but is not limited to: the NearMet name; logos; branding; user interface; visual design; source code; software; graphics; icons; databases; original written content; recommendation systems; Platform architecture.
Nothing in these Terms grants users ownership of NearMet's intellectual property.
Users may not copy, modify, distribute, reverse engineer or commercially exploit any part of the Platform without prior written permission.

20. Feedback
NearMet welcomes suggestions and feedback.
If you voluntarily submit ideas, suggestions, improvements or feature requests you acknowledge that NearMet may use those ideas without any obligation to provide compensation or attribution.
This allows the Platform to improve while avoiding future ownership disputes over general ideas.

21. Third-Party Services
NearMet may integrate with or rely on third-party services to provide certain functionality, including but not limited to: maps and location services; authentication providers; cloud hosting; image storage; analytics; email delivery; security and fraud prevention tools.
These services are operated by independent providers and may have their own terms and privacy policies.
NearMet is not responsible for the content, availability or practices of third-party services.
Your use of such services may also be governed by their respective terms and policies.

22. Platform Availability
While NearMet aims to provide a reliable experience we do not guarantee that the Platform will always be available.
The Platform may occasionally become unavailable due to: maintenance; software updates; security improvements; technical issues; internet failures; third-party service interruptions; circumstances beyond our reasonable control.
Because NearMet is currently operating as a prototype temporary interruptions may occur more frequently than on a fully commercial platform.

23. Future Features
NearMet is continuously evolving.
New features, products, tools and services may be introduced over time.
Unless stated otherwise, these Terms will also apply to future Platform features.
Where additional terms are necessary for a specific feature, those terms will be presented before the feature is used.

24. Disclaimer of Warranties
NearMet is provided on an "as is" and "as available" basis.
To the maximum extent permitted by applicable law, NearMet makes no representations or warranties regarding: uninterrupted availability; accuracy of user-generated content; reliability of recommendations; suitability of experiences; compatibility with particular devices; security against every possible threat; absence of errors or bugs.
Because NearMet is a prototype, users acknowledge that unexpected issues may occur during normal use.
Nothing in these Terms excludes rights that cannot legally be excluded under applicable law.

25. Limitation of Liability
To the maximum extent permitted by applicable law, NearMet and its operator shall not be liable for any indirect, incidental, consequential, special, exemplary or punitive damages arising out of or relating to your use of the Platform.
This includes but is not limited to: loss of data; loss of profits; interruption of business or studies; personal disagreements between users; cancellation of experiences; reliance on inaccurate recommendations; injuries or damages arising from offline interactions; technical failures or service interruptions.
Where liability cannot legally be excluded, it will be limited to the maximum extent permitted by applicable law.

26. Indemnification
You agree to indemnify and hold harmless NearMet and its operator from any claims, liabilities, damages, losses or expenses arising from: your use of the Platform; your violation of these Terms; your infringement of another person's rights; content you upload; experiences you organize; unlawful conduct connected to your account.
This provision survives termination of your account.

27. Suspension and Termination
NearMet may suspend, restrict or terminate your account if you: violate these Terms; repeatedly receive legitimate community reports; engage in fraud; impersonate another person; misuse the Platform; create risks for other users; attempt to interfere with the operation or security of the Platform.
Depending on the nature of the violation, NearMet may: remove specific content; issue warnings; temporarily suspend access; permanently remove your account.
You may stop using NearMet at any time.
Where technically feasible, you may request deletion of your account in accordance with the Privacy Policy.

28. Changes to These Terms
NearMet may update these Terms from time to time to: improve clarity; introduce new features; comply with legal obligations; improve user safety; reflect changes to the Platform.
When material changes are made, NearMet will make reasonable efforts to notify users through the Platform or other appropriate means.
Continued use of NearMet after updated Terms become effective constitutes acceptance of those Terms.

29. Governing Law
These Terms are intended to be interpreted in accordance with the applicable laws of India and United States of America.
As NearMet is currently an independently operated prototype and not yet operated through a registered legal entity, any future incorporation or restructuring of NearMet shall not affect the continued validity of these Terms unless updated versions are published.
If any dispute arises, the parties are encouraged to attempt to resolve the matter amicably before initiating formal legal proceedings.

30. Severability
If any provision of these Terms is determined to be unlawful, invalid, or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect.

31. Entire Agreement
These Terms constitute the entire agreement between you and NearMet regarding your use of the Platform.
They supersede any previous agreements, understandings or communications relating to the same subject matter.

32. Assignment
You may not transfer or assign your rights or obligations under these Terms without prior written permission from NearMet.
NearMet may transfer or assign these Terms in connection with: incorporation of the business; transfer of ownership; merger; acquisition; restructuring; sale of assets.
In such circumstances, NearMet will take reasonable steps to notify users where appropriate.

33. Contact
If you have questions about these Terms or wish to contact NearMet, you may reach us through:
Email: nearmetsupport@gmail.com
or any updated contact information published on the Platform.

Acceptance
By creating an account, accessing or using NearMet, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.`
  const PRIVACY_TEXT = `NearMet is currently an independently operated beta platform under active development. This document describes how the Platform operates during this stage and is intended to provide transparency about your rights and responsibilities while using NearMet. As the Platform evolves or becomes operated by a registered legal entity these documents may be updated accordingly.

1. Introduction
Welcome to NearMet.
Your privacy matters to us.
This Privacy Policy explains how NearMet collects, uses, stores and protects your information when you use the NearMet platform.
NearMet is currently an independently operated beta platform under active development. As the Platform evolves this Privacy Policy may be updated to reflect new features or legal requirements.
By creating an account or using NearMet you acknowledge that you have read and understood this Privacy Policy.
If you do not agree with this Privacy Policy you should not use the Platform.

2. About NearMet
NearMet is designed to help people discover like-minded individuals, explore their city, share genuine recommendations and participate in meaningful real-world experiences.
To make this possible NearMet needs to process certain information that you voluntarily provide as well as limited technical information required to operate the Platform.
NearMet is committed to collecting only the information reasonably necessary to provide and improve the Platform.

3. Information We Collect
The information we collect depends on how you use NearMet.

A. Information You Provide
When you create an account or use NearMet you may provide information including:

Basic Information
Name, Age, Gender, College, Email address, Mobile Number.

Profile Information
You may choose to share information such as: profile photographs; What I Enjoy; Things I Want to Experience; Thoughts; Food Spots; Places Worth Exploring; other profile details you voluntarily provide.

Shared Experiences
If you share recommendations through NearMet we may collect information including: place name; food spot name; location; photographs; your written experience; tags you select; date shared.

Join Experiences
If you create or participate in experiences we may collect: event title; event description; date and time; location; category; available spots; organizer contact details; other information you choose to include.

Communications
If you contact NearMet or submit feedback, bug reports or support requests we may collect the information you provide.

4. Information Collected Automatically
Like most online platforms NearMet may automatically collect limited technical information required to operate the Platform.
This may include: IP address; browser type; device type; operating system; approximate location based on IP; language preferences; date and time of access; pages visited; basic usage statistics; error reports; log files.
This information helps us understand how the Platform is used and identify technical issues.

5. Cookies and Similar Technologies
NearMet may use cookies and similar technologies to: keep you signed in; remember your preferences; improve platform performance; understand how users interact with the Platform; enhance security; improve future features.
Cookies generally do not identify you personally.
You may choose to disable cookies through your browser settings although some features of NearMet may not function correctly as a result.

6. How We Use Your Information
NearMet uses the information it collects to operate, improve and maintain the Platform.
Examples include:

Creating Your Account
To register your account and provide access to the Platform.

Personalizing Your Experience
To help you discover: people with similar interests; experiences; food spots; places worth exploring; relevant recommendations.

Operating the Platform
To display: your profile; your recommendations; your shared experiences; events you create.

Improving NearMet
To: understand user behavior; improve existing features; develop new features; fix bugs; improve reliability.

Safety
To: investigate reports; prevent misuse; detect suspicious activity; protect the Platform; maintain community standards.

Communication
To send: important account notifications; security notices; updates about the Platform; responses to support requests.

NearMet does not use your personal information for unrelated purposes without an appropriate legal basis or your consent where required.

7. Legal Basis for Processing
Where applicable NearMet processes personal information based on one or more of the following grounds: your consent; performance of the services you request; legitimate interests in operating and improving the Platform; compliance with applicable legal obligations.
If applicable law requires consent for a particular activity, NearMet will seek that consent before processing your information for that purpose.

8. Information You Share Publicly
NearMet is designed to help people discover and connect through shared interests, recommendations and experiences. As a result, some information you choose to share may be visible to other users of the Platform.
Depending on the features you use information that may be publicly visible includes: your name; profile photos; college; What I Enjoy; Things I Want to Experience; Thoughts; Food Spot recommendations; Places Worth Exploring; Shared Experiences; Experiences (events) you create; any other content you intentionally publish on the Platform.
Only the information you choose to publish is intended to be visible to other users. NearMet may introduce additional privacy controls in future updates.

9. Sharing Your Information
NearMet does not sell your personal information.
We may share information only in the following circumstances:

Service Providers
NearMet may use trusted third-party providers to operate the Platform such as: cloud hosting providers; database providers; image storage providers; mapping and location services; email delivery services; analytics providers; security and fraud prevention services.
These providers receive only the information reasonably necessary to perform their services on behalf of NearMet.

Legal Requirements
NearMet may disclose information if required to: comply with applicable law; respond to valid legal requests; protect the rights or safety of users; investigate fraud or unlawful activity; protect the Platform from abuse.

Business Changes
If NearMet is incorporated, acquired, merged, transferred or reorganized in the future user information may be transferred as part of that process, subject to applicable law and this Privacy Policy.
Users will be notified where required by law.

10. Data Storage and Security
NearMet takes reasonable administrative, technical and organizational measures to protect your information from unauthorized access, loss, misuse or disclosure.
These measures may include: secure communication protocols; password protection; access controls; encrypted storage where appropriate; monitoring for suspicious activity; regular software updates.
However, no online platform or method of electronic storage can guarantee absolute security.
You acknowledge that information transmitted over the internet always carries some level of risk.

11. Data Retention
NearMet retains personal information only for as long as reasonably necessary to: provide the Platform; maintain your account; improve the Platform; resolve disputes; comply with legal obligations; protect the safety and integrity of the community.
If you delete your account, NearMet will make reasonable efforts to remove or anonymize your personal information within a reasonable period, unless retention is required by law or necessary to protect the Platform.
Some information such as aggregated or anonymized analytics may be retained because it no longer identifies you personally.

12. Your Choices and Rights
Depending on applicable law, you may have the right to: access your personal information; update or correct inaccurate information; request deletion of your account; object to certain processing activities where applicable; withdraw consent where processing is based on your consent.
NearMet will make reasonable efforts to respond to such requests in accordance with applicable law.
Some requests may not be fulfilled where doing so would conflict with legal obligations, protect other users or prevent fraud or abuse.

13. Children's Privacy
NearMet is not intended for children below the minimum age required under applicable law.
We do not knowingly collect personal information from children who are not legally permitted to use the Platform.
If NearMet becomes aware that personal information has been collected from someone who is not eligible to use the Platform, reasonable steps will be taken to remove that information.
Parents or guardians who believe their child has provided personal information may contact NearMet to request its removal.

14. International Data Processing
NearMet may use service providers whose infrastructure operates in different countries.
As a result, your information may be processed or stored outside your country of residence.
Where this occurs NearMet will take reasonable steps to ensure that personal information receives appropriate protection consistent with applicable law.

15. Future Features
NearMet is continuously evolving.
As new features are introduced—such as messaging, groups, verification, payments, subscriptions or additional community tools—this Privacy Policy may be updated to explain how those features process personal information.
Where additional consent is required by law, NearMet will obtain that consent before processing personal information for the new purpose.

16. Changes to This Privacy Policy
NearMet may update this Privacy Policy from time to time.
Updates may occur to: improve clarity; reflect new features; improve user safety; comply with legal obligations; improve platform operations.
When significant changes are made, NearMet will make reasonable efforts to notify users through the Platform or other appropriate means.
The updated Privacy Policy becomes effective once published unless otherwise stated.
Your continued use of NearMet after the effective date of an updated Privacy Policy constitutes your acceptance of those changes.

17. Contact
If you have any questions about this Privacy Policy, your information, or NearMet's privacy practices, you may contact:
NearMet
Email: nearmetsupport@gmail.com
Or any updated contact information published on the Platform.

Acceptance
By creating an account or using NearMet, you acknowledge that you have read and understood this Privacy Policy.`

  if (showTermsModal) return (
    <div style={{ minHeight: "100vh", background: "#FAF8F4", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid #E8D5F0", background: "white" }}>
        <button onClick={() => setShowTermsModal(false)} style={{ fontSize: 20, background: "none", border: "none", cursor: "pointer", color: "#4A4A6A" }}>←</button>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#2F2F33" }}>{termsDoc === 'terms' ? 'Terms of Service' : 'Privacy Policy'}</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px 40px" }}>
        <div style={{ fontSize: 13, color: "#444", lineHeight: 1.8, whiteSpace: "pre-wrap", maxWidth: 640 }}>
          {termsDoc === 'terms' ? TERMS_TEXT : PRIVACY_TEXT}
        </div>
      </div>
      <div style={{ padding: "16px 20px 32px", background: "white", borderTop: "1px solid #E8D5F0" }}>
        <button onClick={() => setShowTermsModal(false)}
          style={{ width: "100%", background: "#581073", color: "white", border: "none", borderRadius: 14, padding: "15px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          Close
        </button>
      </div>
    </div>
  )

  // ── Landing ─────────────────────────────────────────────────────────────────
  if (mode === 'landing') return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#FAF8F4" }}>
      <div style={{ flex: 1, padding: "28px 28px 0", maxWidth: 420, width: "100%", margin: "0 auto", textAlign: "center" }}>

        {/* Logo lockup */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 0 }}>
          <NearMetLogo size={68} />
        </div>

        {/* City skyline illustration */}
        <div style={{ margin: "4px 0 8px" }}>
          <CityIllustration />
        </div>

        {/* Headline with decorative sparkles/cloud/moon */}
        <div style={{ position: "relative", marginTop: 18, marginBottom: 20 }}>
          <CloudShape width={44} style={{ position: "absolute", left: 0, top: -16 }} />
          <Sparkle size={14} color="#FF9A8B" style={{ position: "absolute", left: 6, top: 30 }} />
          <MoonShape size={28} style={{ position: "absolute", right: 2, top: -12 }} />
          <Sparkle size={12} color="#581073" style={{ position: "absolute", right: 34, top: 26 }} />
          <Dot size={5} style={{ left: 60, top: 0 }} />
          <Dot size={5} color="#FF9A8B" style={{ right: 70, top: 2 }} />
          <Dot size={6} style={{ right: 10, top: 28 }} />

          <h1 style={{ fontSize: 29, fontWeight: 800, color: "#1E1B29", letterSpacing: "-0.02em", lineHeight: 1.35, margin: 0 }}>
            Experience what you love<br />
            with <span style={{ color: "#581073" }}>like-minded</span> people.
          </h1>
        </div>

        <div style={{ marginBottom: 26 }}><WavyDivider /></div>

        {/* Feature cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32, textAlign: "left" }}>
          {FEATURES.map(({ Icon, text }, i) => (
            <div key={i} style={{ background: "#F5EDF9", borderRadius: 20, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#EADCF2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon />
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#2F2F33", lineHeight: 1.4 }}>{text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons + footer */}
      <div style={{ padding: "0 28px 40px", maxWidth: 420, width: "100%", margin: "0 auto" }}>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 16, padding: "13px 15px", background: "#F5EDF9", borderRadius: 14, border: "1.5px solid #E8D5F0", textAlign: "left" }}>
          <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)}
            style={{ marginTop: 2, width: 18, height: 18, accentColor: "#581073", flexShrink: 0, cursor: "pointer" }} />
          <span style={{ fontSize: 12.5, color: "#4A4A6A", lineHeight: 1.6 }}>
            I have read and agree to the{' '}
            <span onClick={e => { e.stopPropagation(); setTermsDoc('terms'); setShowTermsModal(true); }}
              style={{ color: "#581073", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>Terms of Service</span>
            {' '}and{' '}
            <span onClick={e => { e.stopPropagation(); setTermsDoc('privacy'); setShowTermsModal(true); }}
              style={{ color: "#581073", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>Privacy Policy</span>
          </span>
        </label>
        <button onClick={() => { if (accepted) { onCreateAccount ? onCreateAccount() : setMode('signup'); } }}
          style={{ width: "100%", background: accepted ? "#581073" : "#D8C3E6", color: "white", border: "none", borderRadius: 16, padding: "16px", fontSize: 16, fontWeight: 700, cursor: accepted ? "pointer" : "not-allowed", marginBottom: 12 }}>
          Get started
        </button>
        <button onClick={() => setMode('signin')}
          style={{ width: "100%", background: "white", color: "#581073", border: "1.5px solid #581073", borderRadius: 16, padding: "15px", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
          I already have an account
        </button>
      </div>
    </div>
  )

  // ── Confirm email ────────────────────────────────────────────────────────────
  if (mode === 'confirm') return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", padding: "48px 24px" }}>
      <NearMetLogo size={36} />
      <div style={{ marginTop: 40, textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>📬</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#2F2F33", marginBottom: 8 }}>Check your email</h2>
        <p style={{ fontSize: 14, color: "#9090B0", lineHeight: 1.6 }}>
          We sent a confirmation link to<br /><strong style={{ color: "#2F2F33" }}>{signedUpEmail}</strong>
        </p>
        <div style={{ marginTop: 24, background: "#F5E8F9", border: "1px solid #F5E8F9", borderRadius: 12, padding: "14px 16px", fontSize: 13, color: "#581073", textAlign: "left" }}>
          <strong>Didn't get it?</strong> Check your spam folder.
        </div>
        <button onClick={() => setMode('signin')}
          style={{ width: "100%", background: "#581073", color: "white", border: "none", borderRadius: 12, padding: 14, fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 24 }}>
          Go to sign in →
        </button>
      </div>
    </div>
  )

  // ── Sign in ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 20px 12px", borderBottom: "1px solid #F5E8F9", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => { if (onBack) onBack(); else setMode('landing'); }}
          style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#4A4A6A" }}>←</button>
        <NearMetLogo size={32} />
      </div>
      <div style={{ flex: 1, padding: "28px 24px", maxWidth: 480, width: "100%", margin: "0 auto" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#2F2F33", marginBottom: 6 }}>Welcome back</h2>
        <p style={{ fontSize: 14, color: "#9090B0", marginBottom: 28 }}>Sign in to your NearMet account.</p>
        <form onSubmit={handleSignIn}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#9090B0", letterSpacing: ".07em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>EMAIL</label>
              <input className="ob-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#9090B0", letterSpacing: ".07em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>PASSWORD</label>
              <input className="ob-input" type="password" placeholder="Your password" value={form.password} onChange={e => set('password', e.target.value)} required />
              {onForgotPassword && (
                <button type="button" onClick={onForgotPassword}
                  style={{ background: "none", border: "none", padding: 0, marginTop: 8, fontSize: 13, fontWeight: 600, color: "#581073", cursor: "pointer" }}>
                  Forgot password?
                </button>
              )}
            </div>
          </div>
          {error && <div style={{ marginTop: 12, background: "#FFF0EE", border: "1px solid #FF9A8B", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#C94E3A" }}>{error}</div>}
          <button className="ob-save-btn" type="submit" disabled={loading} style={{ width: "100%", marginTop: 24 }}>
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>
        <button onClick={() => onCreateAccount ? onCreateAccount() : setMode('landing')}
          style={{ width: "100%", marginTop: 16, textAlign: "center", fontSize: 14, color: "#9090B0", background: "none", border: "none", cursor: "pointer" }}>
          Don't have an account? <span style={{ color: "#581073", fontWeight: 700 }}>Create one</span>
        </button>
      </div>
    </div>
  )
}
