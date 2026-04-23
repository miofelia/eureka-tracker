import { useNavigate } from 'react-router-dom'

export default function LegalNotice() {
  const navigate = useNavigate()

  return (
    <div style={{
      padding: '24px 16px 80px',
      color: '#e5e7eb',
      maxWidth: '680px',
      margin: '0 auto',
      fontSize: '13px',
      lineHeight: '1.7'
    }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none', border: 'none', color: '#a78bfa',
          fontSize: '15px', cursor: 'pointer', padding: '0 0 16px 0', display: 'block'
        }}
      >
        ← Back
      </button>

      <p style={{ color: '#6b7280', marginBottom: '32px' }}>Deutsche Version · English version below</p>

      {/* ══ DEUTSCH ══ */}
      <h1 style={h1}>Impressum</h1>
      <p>Paulina Vogt<br />Lassallestr. 30<br />99086 Erfurt<br />E-Mail: miofelia.xyz(at)gmail.com</p>
      <p style={{ color: '#6b7280', fontSize: '11px' }}>Quelle: https://www.e-recht24.de/impressum-generator.html</p>

      <hr style={divider} />
      <h1 style={h1}>Datenschutzerklärung</h1>

      <h2 style={h2}>1. Datenschutz auf einen Blick</h2>
      <h3 style={h3}>Allgemeine Hinweise</h3>
      <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.</p>
      <h3 style={h3}>Datenerfassung auf dieser Website</h3>
      <p><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle" in dieser Datenschutzerklärung entnehmen.</p>
      <p><strong>Wie erfassen wir Ihre Daten?</strong><br />Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.</p>
      <p><strong>Wofür nutzen wir Ihre Daten?</strong><br />Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.</p>
      <p><strong>Welche Rechte haben Sie bezüglich Ihrer Daten?</strong><br />Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.</p>
      <p><strong>Analyse-Tools und Tools von Drittanbietern</strong><br />Beim Besuch dieser Website kann Ihr Surf-Verhalten statistisch ausgewertet werden. Detaillierte Informationen finden Sie in der folgenden Datenschutzerklärung.</p>

      <h2 style={h2}>2. Hosting</h2>
      <p>Wir nutzen auf unserer Website Vercel, eine Cloud-Deployment-Plattform. Dienstanbieter ist das amerikanische Unternehmen Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789.</p>
      <p>Vercel verarbeitet Daten von Ihnen u.a. auch in den USA. Wir weisen darauf hin, dass nach Meinung des Europäischen Gerichtshofs derzeit kein angemessenes Schutzniveau für den Datentransfer in die USA besteht. Als Grundlage der Datenverarbeitung verwendet Vercel Standardvertragsklauseln (Art. 46 Abs. 2 und 3 DSGVO). Die Datenverarbeitungsbedingungen finden Sie unter <a href="https://vercel.com/legal/dpa" style={lnk}>https://vercel.com/legal/dpa</a>. Mehr Informationen unter <a href="https://vercel.com/legal/privacy-policy" style={lnk}>https://vercel.com/legal/privacy-policy</a>.</p>

      <h2 style={h2}>3. Allgemeine Hinweise und Pflichtinformationen</h2>
      <h3 style={h3}>Datenschutz</h3>
      <p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung. Wir weisen darauf hin, dass die Datenübertragung im Internet Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.</p>
      <h3 style={h3}>Hinweis zur verantwortlichen Stelle</h3>
      <p>Paulina Vogt<br />Lassallestr. 30<br />99086 Erfurt<br />E-Mail: miofelia.xyz(at)gmail.com</p>
      <h3 style={h3}>Speicherdauer</h3>
      <p>Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt.</p>
      <h3 style={h3}>Allgemeine Hinweise zu den Rechtsgrundlagen der Datenverarbeitung</h3>
      <p>Sofern Sie in die Datenverarbeitung eingewilligt haben, verarbeiten wir Ihre personenbezogenen Daten auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO. Sofern Sie in die Speicherung von Cookies eingewilligt haben, erfolgt die Datenverarbeitung zusätzlich auf Grundlage von § 25 Abs. 1 TDDDG. Die Einwilligung ist jederzeit widerrufbar. Sind Ihre Daten zur Vertragserfüllung erforderlich, verarbeiten wir Ihre Daten auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.</p>
      <h3 style={h3}>Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
      <p>Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.</p>
      <h3 style={h3}>Widerspruchsrecht gegen die Datenerhebung (Art. 21 DSGVO)</h3>
      <p style={{ fontSize: '12px' }}>WENN DIE DATENVERARBEITUNG AUF GRUNDLAGE VON ART. 6 ABS. 1 LIT. E ODER F DSGVO ERFOLGT, HABEN SIE JEDERZEIT DAS RECHT, AUS GRÜNDEN, DIE SICH AUS IHRER BESONDEREN SITUATION ERGEBEN, GEGEN DIE VERARBEITUNG IHRER PERSONENBEZOGENEN DATEN WIDERSPRUCH EINZULEGEN. WENN SIE WIDERSPRUCH EINLEGEN, WERDEN WIR IHRE BETROFFENEN PERSONENBEZOGENEN DATEN NICHT MEHR VERARBEITEN, ES SEI DENN, WIR KÖNNEN ZWINGENDE SCHUTZWÜRDIGE GRÜNDE FÜR DIE VERARBEITUNG NACHWEISEN (WIDERSPRUCH NACH ART. 21 ABS. 1 DSGVO). WERDEN IHRE PERSONENBEZOGENEN DATEN VERARBEITET, UM DIREKTWERBUNG ZU BETREIBEN, SO HABEN SIE DAS RECHT, JEDERZEIT WIDERSPRUCH EINZULEGEN (WIDERSPRUCH NACH ART. 21 ABS. 2 DSGVO).</p>
      <h3 style={h3}>Beschwerderecht bei der zuständigen Aufsichtsbehörde</h3>
      <p>Zuständige Aufsichtsbehörde: Thüringer Landesbeauftragter für den Datenschutz und die Informationsfreiheit (TLfDI)<br />Dr. Lutz Hasse · Häßlerstraße 8 · 99096 Erfurt<br /><a href="https://www.tlfdi.de" style={lnk}>www.tlfdi.de</a></p>
      <h3 style={h3}>Recht auf Datenübertragbarkeit</h3>
      <p>Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, maschinenlesbaren Format aushändigen zu lassen.</p>
      <h3 style={h3}>Auskunft, Berichtigung und Löschung</h3>
      <p>Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ggf. ein Recht auf Berichtigung oder Löschung dieser Daten.</p>
      <h3 style={h3}>Recht auf Einschränkung der Verarbeitung</h3>
      <p>Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen, wenn Sie die Richtigkeit der Daten bestreiten, die Verarbeitung unrechtmäßig ist oder Sie einen Widerspruch nach Art. 21 Abs. 1 DSGVO eingelegt haben.</p>
      <h3 style={h3}>SSL- bzw. TLS-Verschlüsselung</h3>
      <p>Diese Seite nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt.</p>

      <h2 style={h2}>4. Datenerfassung auf dieser Website</h2>
      <h3 style={h3}>Cookies</h3>
      <p>Unsere Internetseiten können sogenannte „Cookies" verwenden. Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben.</p>
      <p>Unsere Website verwendet keine Cookies zu Tracking-, Marketing- oder Analysezwecken. Es werden lediglich technisch notwendige Cookies eingesetzt, die für den sicheren und fehlerfreien Betrieb der Seite erforderlich sind (z. B. durch unseren Hoster Vercel zur Lastverteilung oder Sicherheit).</p>
      <h3 style={h3}>Lokale Speicherung im Browser (LocalStorage / IndexedDB)</h3>
      <p>Um die Funktionen dieser Anwendung bereitzustellen, nutzen wir die Möglichkeit, Daten lokal in Ihrem Browser zu speichern (sog. „Local Storage" oder „IndexedDB" via localForage).</p>
      <p><strong>Art der Daten:</strong> Sammelfortschritt der Items wird direkt auf Ihrem Endgerät gespeichert.<br />
      <strong>Keine Übertragung:</strong> Diese Daten verbleiben lokal auf Ihrem Gerät und werden nicht an unsere Server oder an Dritte übertragen. Wir haben keinen Zugriff auf diese lokal gespeicherten Informationen.<br />
      <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO.<br />
      <strong>Kontrolle:</strong> Sie können die lokal gespeicherten Daten jederzeit über die Einstellungen Ihres Browsers löschen.</p>
      <h3 style={h3}>Server-Log-Dateien</h3>
      <p>Der Hoster dieser Website (Vercel Inc.) erhebt und speichert automatisch Informationen in Server-Log-Dateien: Browsertyp und -version, Betriebssystem, Referrer URL, Hostname, Uhrzeit der Serveranfrage, IP-Adresse. Eine Zusammenführung mit anderen Datenquellen wird nicht vorgenommen. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Wir haben mit Vercel Inc. einen Vertrag zur Auftragsverarbeitung abgeschlossen.</p>

      <h2 style={h2}>5. Partnerprogramme – Ko-fi</h2>
      <p>Wir nutzen die Plattform „Ko-fi" (Ko-fi Labs Limited, The Station House, 15 Station Road, St. Ives, United Kingdom, PE27 5BH), um freiwillige Spenden abzuwickeln.</p>
      <p><strong>Zweck:</strong> Abwicklung von freiwilligen Unterstützungen.<br />
      <strong>Daten:</strong> Wenn Sie uns über Ko-fi unterstützen, erhalten wir personenbezogene Daten (Name, E-Mail-Adresse, Zahlungsdetails über PayPal).<br />
      <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO.<br />
      <strong>Datenschutzbestimmungen:</strong> <a href="https://more.ko-fi.com/privacy" style={lnk}>https://more.ko-fi.com/privacy</a></p>
      <p>Die Zahlungsabwicklung erfolgt direkt über Ko-fi mittels PayPal. Wir haben keinen direkten Zugriff auf Ihre Bankverbindungen. Die Daten werden nur im Rahmen der notwendigen Abwicklung weitergegeben. Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung oder Einschränkung der Verarbeitung Ihrer Daten. Wir haben keinen Einfluss auf die Datenverarbeitung durch Ko-fi.</p>
      <p style={{ color: '#6b7280', fontSize: '11px', marginTop: '24px' }}>Quelle: https://www.e-recht24.de · Angepasst durch den Betreiber</p>

      {/* ══ ENGLISH ══ */}
      <hr style={{ ...divider, marginTop: '48px' }} />
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>English Translation (for reference)</p>

      <h1 style={h1}>Legal Notice (Impressum)</h1>
      <p>Paulina Vogt<br />Lassallestr. 30<br />99086 Erfurt, Germany<br />E-mail: miofelia.xyz(at)gmail.com</p>

      <h1 style={{ ...h1, marginTop: '32px' }}>Privacy Policy</h1>

      <h2 style={h2}>1. Privacy at a Glance</h2>
      <p>The following notes provide a simple overview of what happens to your personal data when you visit this website. Personal data is any data by which you can be personally identified.</p>
      <p><strong>Who is responsible?</strong> The website operator. Contact details are in the "Controller" section below.</p>
      <p><strong>Your rights:</strong> You have the right to receive information about the origin, recipient and purpose of your stored personal data free of charge at any time, and to request correction or deletion. You may also lodge a complaint with the competent supervisory authority.</p>

      <h2 style={h2}>2. Hosting</h2>
      <p>We use Vercel (Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA). Vercel may process data in the USA. As a basis, we use Standard Contractual Clauses (Art. 46 para. 2 and 3 GDPR). Further information: <a href="https://vercel.com/legal/privacy-policy" style={lnk}>vercel.com/legal/privacy-policy</a></p>

      <h2 style={h2}>3. General Information</h2>
      <p><strong>Controller:</strong> Paulina Vogt · Lassallestr. 30 · 99086 Erfurt · miofelia.xyz(at)gmail.com</p>
      <p><strong>Right to object (Art. 21 GDPR):</strong> WHERE DATA PROCESSING IS BASED ON ART. 6 PARA. 1 LIT. E OR F GDPR, YOU HAVE THE RIGHT TO OBJECT TO PROCESSING AT ANY TIME ON GROUNDS RELATING TO YOUR PARTICULAR SITUATION.</p>
      <p><strong>Supervisory authority:</strong> Thüringer Landesbeauftragter für den Datenschutz und die Informationsfreiheit (TLfDI) · <a href="https://www.tlfdi.de" style={lnk}>www.tlfdi.de</a></p>

      <h2 style={h2}>4. Data Collection on This Website</h2>
      <p><strong>Cookies:</strong> This website does not use tracking, marketing or analytics cookies. Only technically necessary cookies may be set by Vercel for load balancing or security.</p>
      <p><strong>Local Storage / IndexedDB:</strong> This app uses localForage (IndexedDB) to store your collection progress locally on your device. This data is not transmitted to our servers or any third party. We have no access to it. Legal basis: Art. 6 para. 1 lit. f GDPR.</p>
      <p><strong>Server log files:</strong> Vercel automatically collects server log files (browser type, OS, referrer URL, IP address, time of access). Legal basis: Art. 6 para. 1 lit. f GDPR. A Data Processing Agreement has been concluded with Vercel Inc.</p>

      <h2 style={h2}>5. Ko-fi (Donations)</h2>
      <p>We use Ko-fi (Ko-fi Labs Limited, The Station House, 15 Station Road, St. Ives, UK, PE27 5BH) to process voluntary donations. If you support us via Ko-fi, Ko-fi will receive personal data (name, email, payment details via PayPal). Legal basis: Art. 6 para. 1 lit. b GDPR. Privacy policy: <a href="https://more.ko-fi.com/privacy" style={lnk}>more.ko-fi.com/privacy</a>. We have no influence over data processing by Ko-fi.</p>
    </div>
  )
}

const h1 = { fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', marginTop: '8px' }
const h2 = { fontSize: '15px', fontWeight: '700', color: '#ffffff', marginTop: '28px', marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid #374151' }
const h3 = { fontSize: '13px', fontWeight: '600', color: '#c4b5fd', marginTop: '18px', marginBottom: '4px' }
const divider = { border: 'none', borderTop: '1px solid #374151', margin: '32px 0' }
const lnk = { color: '#a78bfa' }
