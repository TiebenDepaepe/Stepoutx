import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-charcoal mb-2">
          Privacybeleid StepOutX
        </h1>
        <p className="text-sm text-charcoal/60 mb-10">
          <strong>Laatst bijgewerkt:</strong> 17 mei 2026
        </p>

        <article className="prose-stepout space-y-10 text-charcoal/80 leading-relaxed">
          <section>
            <h2 className="font-display text-2xl font-bold text-charcoal mb-4">
              1. Wie zijn wij?
            </h2>
            <p>
              StepOutX is een initiatief van Daria Kenis, een geregistreerde
              zelfstandige natuurlijke persoon naar Belgisch recht.
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li>Ondernemingsnummer: 1026.560.601</li>
              <li>BTW-nummer: BE1026560601</li>
              <li>
                E-mail:{' '}
                <a
                  href="mailto:daria@stepoutx.com"
                  className="text-purple-accent hover:underline"
                >
                  daria@stepoutx.com
                </a>
              </li>
              <li>Website: https://stepoutx.com</li>
            </ul>
            <p className="mt-3">
              Daria Kenis is de verwerkingsverantwoordelijke in de zin van
              artikel 4.7 van de Algemene Verordening Gegevensbescherming
              (AVG/GDPR).
            </p>
            <p className="mt-3">
              Voor vragen over dit privacybeleid of over jouw persoonsgegevens
              kan je contact opnemen via{' '}
              <a
                href="mailto:daria@stepoutx.com"
                className="text-purple-accent hover:underline"
              >
                daria@stepoutx.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-charcoal mb-4">
              2. Welke persoonsgegevens verwerken wij?
            </h2>
            <p>
              Wij verwerken uitsluitend persoonsgegevens die noodzakelijk zijn
              voor de organisatie en uitvoering van een StepOutX-ervaring.
            </p>
            <p className="mt-3">
              <strong>Bij bezoek aan onze website</strong> kunnen via Meta Pixel
              en analytische cookies gegevens worden verzameld over je bezoek
              (IP-adres, browsertype, apparaat, bezochte pagina's, klikgedrag).
              Dit gebeurt enkel nadat je daarvoor toestemming hebt gegeven via
              onze cookiebanner.
            </p>
            <p className="mt-3">
              Bij inschrijving via onze website kunnen wij volgende gegevens
              verzamelen:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>voornaam en familienaam</li>
              <li>geslacht</li>
              <li>geboortedatum</li>
              <li>woonplaats</li>
              <li>telefoonnummer</li>
              <li>e-mailadres</li>
              <li>motivatie voor deelname</li>
              <li>
                video's en/of foto's die je vrijwillig indient tijdens de
                selectieprocedure
              </li>
            </ul>
            <p className="mt-3">
              Na selectie kunnen bijkomende gegevens worden gevraagd:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                betalingsgegevens (betalingen verlopen via Mollie of
                overschrijving; StepOutX heeft geen toegang tot kaartgegevens
                of volledige bankinformatie)
              </li>
              <li>
                noodcontact (naam, telefoonnummer en relatie tot de deelnemer)
              </li>
              <li>
                relevante gezondheidsinformatie zoals allergieën, medicatie,
                dieetwensen, mobiliteitsinformatie of andere noodzakelijke
                veiligheidsinformatie
              </li>
            </ul>
            <p className="mt-3">
              Wij vragen uitsluitend gezondheidsinformatie die noodzakelijk is
              voor een veilige uitvoering van de ervaring.
            </p>
            <p className="mt-3">
              Persoonsgegevens worden opgeslagen op beveiligde servers en zijn
              enkel toegankelijk voor personen die deze informatie nodig hebben
              voor de uitvoering van de ervaring.
            </p>
            <p className="mt-3">Toegang kan worden verleend aan:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Daria Kenis</li>
              <li>geselecteerde begeleiders</li>
            </ul>
            <p className="mt-3">
              Begeleiders ontvangen uitsluitend informatie die noodzakelijk is
              voor een veilige begeleiding, zoals:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>naam</li>
              <li>telefoonnummer</li>
              <li>noodcontact</li>
              <li>relevante gezondheidsinformatie</li>
            </ul>
            <p className="mt-3">
              Niet-noodzakelijke gezondheidsinformatie blijft uitsluitend
              toegankelijk voor de organisator.
            </p>
            <p className="mt-3">
              Alle begeleiders ondertekenen vooraf een
              vertrouwelijkheidsverklaring.
            </p>
            <p className="mt-3">
              Voor communicatie kunnen deelnemers worden toegevoegd aan
              WhatsApp-groepen. Hierbij zijn telefoonnummers zichtbaar voor
              andere deelnemers binnen dezelfde groep.
            </p>
            <p className="mt-3">
              Tijdens ervaringen kunnen foto's en video's worden gemaakt. Deze
              worden uitsluitend gebruikt na voorafgaande toestemming.
            </p>
            <p className="mt-3">
              Toestemming voor beeldmateriaal is volledig vrijwillig en kan op
              elk moment worden ingetrokken.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-charcoal mb-4">
              3. Waarom verwerken wij deze gegevens?
            </h2>
            <p>
              Wij verwerken persoonsgegevens uitsluitend voor volgende
              doeleinden:
            </p>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="font-semibold text-charcoal">
                  Behandeling van inschrijvingen en selectie van deelnemers
                </dt>
                <dd className="text-charcoal/70">
                  Rechtsgrond: precontractuele maatregelen (art. 6.1.b AVG)
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-charcoal">
                  Organisatie en uitvoering van de ervaring
                </dt>
                <dd className="text-charcoal/70">
                  Rechtsgrond: uitvoering overeenkomst (art. 6.1.b AVG)
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-charcoal">
                  Communicatie voor, tijdens en na deelname
                </dt>
                <dd className="text-charcoal/70">
                  Rechtsgrond: uitvoering overeenkomst (art. 6.1.b AVG)
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-charcoal">
                  Noodsituaties tijdens de ervaring
                </dt>
                <dd className="text-charcoal/70">
                  Rechtsgrond: uitvoering overeenkomst (art. 6.1.b AVG)
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-charcoal">
                  Boekhouding en administratieve verplichtingen
                </dt>
                <dd className="text-charcoal/70">
                  Rechtsgrond: wettelijke verplichting (art. 6.1.c AVG)
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-charcoal">
                  Gebruik van foto's en video's voor website, sociale media en
                  promotie
                </dt>
                <dd className="text-charcoal/70">
                  Rechtsgrond: toestemming (art. 6.1.a AVG)
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-charcoal">
                  Publicatie van getuigenissen en reviews
                </dt>
                <dd className="text-charcoal/70">
                  Rechtsgrond: toestemming (art. 6.1.a AVG)
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-charcoal">
                  Analyse van websitegebruik en advertenties via cookies en
                  Meta Pixel
                </dt>
                <dd className="text-charcoal/70">
                  Rechtsgrond: toestemming (art. 6.1.a AVG)
                </dd>
              </div>
            </dl>
            <p className="mt-4">
              Gezondheidsgegevens zijn bijzondere persoonsgegevens onder
              artikel 9 AVG. Hiervoor vragen wij steeds afzonderlijke en
              uitdrukkelijke toestemming.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-charcoal mb-4">
              4. Met wie delen wij gegevens?
            </h2>
            <p>Wij verkopen persoonsgegevens nooit.</p>
            <p className="mt-3">
              Wij delen persoonsgegevens enkel indien dit noodzakelijk is met:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>GitHub, Inc.</strong> (Verenigde Staten) — hosting van
                onze website via GitHub Pages
              </li>
              <li>
                <strong>Supabase Inc.</strong> (Verenigde Staten) — databank
                voor inschrijvingen, video's, foto's en gerelateerde gegevens
              </li>
              <li>
                <strong>Mollie B.V.</strong> — verwerking van betalingen
              </li>
              <li>
                <strong>Google LLC</strong> — zakelijke e-mailcommunicatie
              </li>
              <li>
                <strong>Meta Platforms Ireland Ltd.</strong> —
                WhatsApp-communicatie, Instagram en Meta Pixel
              </li>
              <li>
                <strong>TikTok Technology Limited</strong> — publicatie van
                content op TikTok
              </li>
              <li>
                <strong>Cybot A/S</strong> (Denemarken, Cookiebot) — beheer van
                cookietoestemming op onze website
              </li>
              <li>
                <strong>geselecteerde begeleiders</strong> — uitsluitend
                noodzakelijke gegevens voor veilige uitvoering
              </li>
              <li>
                <strong>boekhouder en bevoegde overheidsinstanties</strong> —
                indien wettelijk verplicht
              </li>
            </ul>
            <p className="mt-3">
              StepOutX beschikt over een aansprakelijkheidsverzekering voor de
              organisatie. Deelnemers worden aangeraden om indien gewenst zelf
              een persoonlijke reis-, ongevallen- of annulatieverzekering af te
              sluiten.
            </p>
            <p className="mt-3">
              Wanneer wettelijk vereist worden passende overeenkomsten
              afgesloten om persoonsgegevens te beschermen.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-charcoal mb-4">
              5. Hoe lang bewaren wij gegevens?
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Niet-geselecteerde kandidaten: uiterlijk 1 maand na selectie
              </li>
              <li>
                Gezondheidsinformatie: uiterlijk 6 maanden na einde ervaring
              </li>
              <li>Noodcontacten: uiterlijk 6 maanden na einde ervaring</li>
              <li>
                Deelnamegegevens en deelnameovereenkomsten: maximaal 2 jaar na
                de ervaring
              </li>
              <li>
                Foto's en video's met toestemming: zolang toestemming geldig
                blijft
              </li>
              <li>
                Reviews en getuigenissen: zolang toestemming geldig blijft
              </li>
              <li>
                Facturen en boekhoudkundige gegevens: 7 jaar conform Belgische
                wetgeving
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-charcoal mb-4">
              6. Doorgifte buiten de Europese Economische Ruimte
            </h2>
            <p>
              Sommige dienstverleners zoals GitHub, Supabase, Google, Meta en
              TikTok kunnen persoonsgegevens gedeeltelijk verwerken buiten de
              Europese Economische Ruimte.
            </p>
            <p className="mt-3">
              Indien dit gebeurt, gebeurt dit via wettelijke
              beschermingsmechanismen zoals standaardcontractbepalingen of het
              EU-US Data Privacy Framework overeenkomstig artikelen 45–46 AVG.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-charcoal mb-4">
              7. Beveiliging
            </h2>
            <p>
              Wij nemen passende technische en organisatorische maatregelen om
              persoonsgegevens te beschermen, waaronder:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>beveiligde verbindingen (HTTPS/TLS)</li>
              <li>beperkte toegangsrechten</li>
              <li>opslag op beveiligde servers</li>
              <li>vertrouwelijkheidsverplichtingen voor begeleiders</li>
            </ul>
            <p className="mt-3">
              Bij een datalek met risico voor betrokkenen wordt dit gemeld
              conform de wettelijke verplichtingen.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-charcoal mb-4">
              8. Jouw rechten
            </h2>
            <p>Je hebt onder de AVG onder meer recht op:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>inzage</li>
              <li>verbetering</li>
              <li>verwijdering</li>
              <li>beperking</li>
              <li>overdraagbaarheid</li>
              <li>bezwaar</li>
              <li>intrekken van toestemming</li>
            </ul>
            <p className="mt-3">
              Verzoeken kunnen worden gestuurd naar:{' '}
              <a
                href="mailto:daria@stepoutx.com"
                className="text-purple-accent hover:underline"
              >
                daria@stepoutx.com
              </a>
            </p>
            <p className="mt-3">Wij reageren in principe binnen één maand.</p>
            <p className="mt-3">
              Indien je niet tevreden bent over de verwerking van je gegevens
              kan je klacht indienen bij:
            </p>
            <address className="not-italic mt-2 pl-4 border-l-2 border-charcoal/20">
              Gegevensbeschermingsautoriteit
              <br />
              Drukpersstraat 35
              <br />
              1000 Brussel
            </address>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-charcoal mb-4">
              9. Cookies
            </h2>
            <p>
              Onze website gebruikt noodzakelijke, analytische en
              marketingcookies.
            </p>
            <p className="mt-3">
              Wij gebruiken Meta Pixel om inzicht te krijgen in websitegebruik
              en om relevante advertenties te tonen aan geïnteresseerde
              bezoekers.
            </p>
            <p className="mt-3">
              Niet-noodzakelijke cookies worden enkel geplaatst nadat je
              toestemming hebt gegeven via onze cookiebanner. Het beheer van
              deze toestemming gebeurt via Cookiebot (Cybot A/S).
            </p>
            <p className="mt-3">
              Je kan je voorkeuren op elk moment wijzigen via de cookieknop op
              onze website.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-charcoal mb-4">
              10. Wijzigingen
            </h2>
            <p>
              StepOutX kan dit privacybeleid aanpassen wanneer wetgeving of
              werkwijze verandert. De meest recente versie staat steeds op de
              website.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-charcoal mb-4">
              11. Contact
            </h2>
            <p>Voor vragen over privacy of persoonsgegevens:</p>
            <p className="mt-2">
              <a
                href="mailto:daria@stepoutx.com"
                className="text-purple-accent hover:underline"
              >
                daria@stepoutx.com
              </a>
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
