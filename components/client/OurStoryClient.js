'use client';
import { useEffect } from 'react';
import { initOurStory } from '@/lib/ourStoryBehavior';

// Mounts the scroll reveals, gallery filter and video dialog for the Our Story section.
export default function OurStoryClient({ rootId = 'our-story' }) {
  useEffect(() => initOurStory(document.getElementById(rootId)), [rootId]);
  return null;
}
