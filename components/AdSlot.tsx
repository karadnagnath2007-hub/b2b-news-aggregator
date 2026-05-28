import adsConfig from '../config/ads-config.json';

type AdPlacementKey = keyof typeof adsConfig.placements;

type DirectContent = {
  text?: string;
  link?: string;
  image_url?: string;
};

interface AdSlotProps {
  slot: AdPlacementKey;
  premiumUser?: boolean;
}

export function AdSlot({ slot, premiumUser = false }: AdSlotProps) {
  const placement = adsConfig.placements[slot];

  if (!placement || !placement.active) {
    return null;
  }

  if (premiumUser && adsConfig.ad_settings.disable_all_ads_for_premium) {
    return null;
  }

  if (placement.type === 'direct') {
    const content = placement.content as DirectContent;

    if (content.image_url) {
      return (
        <a
          href={content.link ?? '#'}
          className="block overflow-hidden rounded-2xl border border-stone-300 bg-white shadow-sm transition hover:shadow-md"
        >
          <img
            src={content.image_url}
            alt="Sponsored banner"
            className="h-40 w-full object-cover"
          />
        </a>
      );
    }

    return (
      <a
        href={content.link ?? '#'}
        className="block rounded-2xl border border-stone-300 bg-white px-6 py-4 text-sm text-stone-700 shadow-sm transition hover:bg-stone-50"
      >
        <span className="font-semibold text-stone-900">Sponsor:</span> {content.text}
      </a>
    );
  }

  if (placement.type === 'adsense') {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-6 py-8 text-center text-sm text-stone-500">
        <div className="mb-2 text-xs uppercase tracking-[0.24em] text-stone-400">Sponsored Content</div>
        <div className="font-medium text-stone-700">Adsense Placeholder</div>
        <div className="mt-2 text-xs text-stone-500">Native ad unit reserved for contextual business sponsorship.</div>
      </div>
    );
  }

  return null;
}
