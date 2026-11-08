import { Download } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { VOORWAARDEN_BLOKKEN, VOORWAARDEN_TITEL } from './algemeneVoorwaardenTekst';

/** Same file as the PDF Daria shared, so people can save or print the signed version. */
const PDF_PATH = '/algemene-voorwaarden-stepout.pdf';

export default function AlgemeneVoorwaarden() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-charcoal mb-4">
          {VOORWAARDEN_TITEL}
        </h1>
        <a
          href={PDF_PATH}
          download
          className="inline-flex items-center gap-2 mb-10 text-sm font-medium text-purple-accent hover:underline"
        >
          <Download className="w-4 h-4" />
          Download als PDF
        </a>

        <article className="space-y-4 text-charcoal/80 leading-relaxed">
          {VOORWAARDEN_BLOKKEN.map((block, i) => {
            switch (block.type) {
              case 'group':
                return (
                  <h2
                    key={i}
                    className="font-display text-2xl md:text-3xl font-bold text-charcoal pt-10 border-t border-charcoal/10"
                  >
                    {block.text}
                  </h2>
                );
              case 'h2':
                return (
                  <h2 key={i} className="font-display text-2xl font-bold text-charcoal pt-6">
                    {block.text}
                  </h2>
                );
              case 'h3':
                return (
                  <h3 key={i} className="font-display text-lg font-semibold text-charcoal pt-2">
                    {block.text}
                  </h3>
                );
              case 'ul':
                return (
                  <ul key={i} className="list-disc pl-6 space-y-1">
                    {block.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                );
              default:
                return <p key={i}>{block.text}</p>;
            }
          })}
        </article>
      </main>
      <Footer />
    </div>
  );
}
