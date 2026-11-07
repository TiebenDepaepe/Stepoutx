// EmailJS configuratie voor automatische mails bij inschrijving
// Vul hieronder je 3 gegevens van https://dashboard.emailjs.com/ in:
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_amj6m3q';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_tpc4rl5';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'QxosUbEvgRRSc8tLU';

const ADMIN_NOTIFICATION_EMAIL = 'daria@stepoutx.com';

export interface ConfirmationEmailParams {
  naam: string;
  email: string;
  gsm: string;
  woonplaats: string;
  instagram: string;
  expeditieVoorkeur: string;
  beschikbaarheid: string[];
  motivatie: string;
}

/**
 * Genereert de exacte bevestigingsmail voor de deelnemer.
 */
function buildParticipantMessage(voornaam: string): string {
  return `Hey ${voornaam}!

YESSS, je hebt je aangemeld voor PlotTwist!

Hoe zot is het eigenlijk? Je schrijft je in voor een avontuur met mensen die je nog nooit hebt ontmoet, zonder te weten waar je precies terechtkomt.

En wie weet wordt dit wel een van de leukste verhalen die je ooit gaat vertellen!

Wat gebeurt er nu?

We gaan aan de slag met jouw inschrijving! Bij PlotTwist gooien we niet zomaar 8 onbekenden samen. We bekijken elke inschrijving zorgvuldig om een groep samen te stellen die echt bij elkaar past.

Zodra we een geschikte groep voor jou hebben gevonden, hoor je van ons wat de volgende stappen zijn.

Nog even belangrijk:

- Je inschrijving is goed ontvangen, maar je plaats is nog niet bevestigd.
- Je hoeft voorlopig niets te betalen.
- Hou je mailbox (en je spamfolder) goed in de gaten!

En voor de rest? Laat het onbekende maar op je afkomen. Want de leukste verhalen zijn vaak degene die je niet zag aankomen.

7 strangers. 6 days. 1 PlotTwist.

Tot snel!

Daria
Founder PlotTwist Travel`;
}

/**
 * Genereert het overzicht voor de melding naar daria@stepoutx.com.
 */
function buildAdminNotificationMessage(params: ConfirmationEmailParams): string {
  return `Hey Daria,

Er is net een nieuwe inschrijving binnengekomen voor PlotTwist!

Naam: ${params.naam}
E-mail: ${params.email}
GSM: ${params.gsm}
Woonplaats: ${params.woonplaats}
Instagram: ${params.instagram || '-'}
Expeditievoorkeur: ${params.expeditieVoorkeur}
Beschikbaarheid: ${params.beschikbaarheid.join(', ')}

Motivatie:
${params.motivatie}

Bekijk alle antwoorden, foto en video in het Admin Dashboard op de website.`;
}

async function sendEmailJS(templateParams: Record<string, string>): Promise<void> {
  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: templateParams,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.warn('EmailJS verzending mislukt:', errorText);
  }
}

/**
 * Verstuurt automatisch:
 * 1. De bevestigingsmail naar het e-mailadres dat de deelnemer in het formulier heeft ingevuld
 * 2. Een melding van de nieuwe inschrijving naar daria@stepoutx.com
 */
export async function sendRegistrationConfirmationEmail(
  params: ConfirmationEmailParams
): Promise<void> {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.info('EmailJS is nog niet geconfigureerd (Service ID, Template ID of Public Key ontbreekt).');
    return;
  }

  const recipientEmail = params.email.trim();
  const voornaam = params.naam.trim().split(/\s+/)[0] || params.naam;
  const participantMessage = buildParticipantMessage(voornaam);
  const adminMessage = buildAdminNotificationMessage(params);

  try {
    await Promise.allSettled([
      // 1. Bevestigingsmail naar het e-mailadres dat in Deel 1 (vraag 5) is ingevuld
      sendEmailJS({
        to_email: recipientEmail,
        email: recipientEmail,
        user_email: recipientEmail,
        recipient: recipientEmail,
        to_name: params.naam,
        name: params.naam,
        user_name: params.naam,
        voornaam,
        Voornaam: voornaam,
        from_name: 'PlotTwist Travel',
        reply_to: ADMIN_NOTIFICATION_EMAIL,
        subject: 'YESSS, je hebt je aangemeld voor PlotTwist!',
        message: participantMessage,
      }),

      // 2. Melding naar daria@stepoutx.com
      sendEmailJS({
        to_email: ADMIN_NOTIFICATION_EMAIL,
        email: ADMIN_NOTIFICATION_EMAIL,
        user_email: ADMIN_NOTIFICATION_EMAIL,
        recipient: ADMIN_NOTIFICATION_EMAIL,
        to_name: 'Daria',
        name: 'Daria',
        user_name: 'Daria',
        voornaam: 'Daria',
        Voornaam: 'Daria',
        from_name: params.naam,
        reply_to: recipientEmail,
        subject: `Nieuwe PlotTwist inschrijving: ${params.naam}`,
        message: adminMessage,
      }),
    ]);
  } catch (err) {
    console.warn('Fout bij versturen automatische e-mails:', err);
  }
}

export interface QuestionEmailParams {
  naam: string;
  email: string;
  vraag: string;
}

/**
 * Verstuurt een vraag vanuit de FAQ-sectie rechtstreeks naar daria@stepoutx.com.
 */
export async function sendQuestionEmail(params: QuestionEmailParams): Promise<boolean> {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    return false;
  }

  const senderEmail = params.email.trim();
  const senderName = params.naam.trim() || 'Bezoeker';

  const message = `Hey Daria,

Er is een nieuwe vraag gesteld via de PlotTwist-website:

Naam: ${senderName}
E-mailadres: ${senderEmail}

Vraag:
${params.vraag.trim()}

(Je kunt direct op deze mail antwoorden om terug te mailen naar ${senderEmail}.)`;

  try {
    await sendEmailJS({
      to_email: ADMIN_NOTIFICATION_EMAIL,
      email: ADMIN_NOTIFICATION_EMAIL,
      user_email: ADMIN_NOTIFICATION_EMAIL,
      recipient: ADMIN_NOTIFICATION_EMAIL,
      to_name: 'Daria',
      name: 'Daria',
      user_name: 'Daria',
      voornaam: 'Daria',
      Voornaam: 'Daria',
      from_name: senderName,
      reply_to: senderEmail,
      subject: `Nieuwe vraag via website van ${senderName}`,
      message,
    });
    return true;
  } catch (err) {
    console.warn('Fout bij versturen vraag:', err);
    return false;
  }
}

