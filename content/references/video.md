# video — Video: hook, structure, and shot direction for the target platform.

## Intake

- Platform and target length
- Single payoff the viewer came for
- Source facts, demo footage, or talking points
- On-camera vs VO vs screen-record format
- Default stack: Opencut / DaVinci for edit, VidIQ for packaging — or any editor plus packaging tool.

## Deliverable

A shooting-ready script: a first-3-second hook, beats with visuals/shot direction, spoken lines (VO or on-camera), B-roll cues, and a CTA — plus 2 hook variants.

## Procedure

1. Tag discovery intent first as go/no-go gate: proceed to scripting only on a real search/browse demand signal.
2. Write the hook for the first 3 seconds — the reason not to scroll.
3. State the single payoff up front; deliver on it in the body.
4. Structure beats: hook → promise → proof/demo → payoff → CTA.
5. Write spoken lines for the ear — short, conversational, no clauses that trip the tongue.
6. Add visual/shot direction per beat (screen record, B-roll, on-camera, text on screen).
7. Keep to the platform's length norms; cut anything that delays the payoff.
8. Pair title and thumbnail with zero word overlap; deliver 3 angle pairs to test.
9. Provide 2 hook variants for testing; add captions on delivery.
10. For reference-video rebuilds, tear down in layers before scripting: story arc, layout/framing, motion mechanisms named exactly (pinned, scrubbed, parallax, mask), visual tokens, technical rebuild mapping, mobile + reduced-motion behavior — concrete mechanisms, never "similar animation" (keeper: mengto/video-to-superprompt).
11. For screen-record demos, choreograph sparse purposeful cursor paths (pause-click-move, no wandering), verify output with ffprobe/thumbnail checks, and confirm captures are non-empty and representative (keeper: mengto/browser-video-recording).
12. For VO/narration, route voice identity through local profiles only; never print secrets or mutate saved account settings per request (keeper: mengto/elevenlabs-tts).
13. For production beyond scripting, pick the pipeline from the job (source: marketingskills `video` SKILL.md): Hyperframes-style HTML rendering for programmatic/templated output vs Remotion-style React rendering for code-composed motion — decide on templating needs and team stack, not hype. When using AI generation, slot the model to the shot (Veo/Sora/Runway/Kling/Seedance/Hailuo/Pika/open-weights each carry different cost/quality slots) and record which model made which shot for re-runs.
14. Reverse-engineer reference edits with an edit anatomy before rebuilding: cut cadence, transition grammar, text-on-screen system, sound-design layering, pacing curve — named mechanisms per beat, never "similar vibe".

## Quality gate

- [ ] Hook lands within 3 seconds.
- [ ] Discovery-intent gate passed before scripting.
- [ ] One payoff, delivered.
- [ ] Lines are speakable, not written-prose.
- [ ] Shot/visual direction per beat.
- [ ] Length matches platform norms.
- [ ] Title-thumbnail pair has zero word overlap; 3 angle pairs delivered.
 - [ ] Hook variants + captions included.
 - [ ] Production pipeline picked by job (programmatic vs code-composed); AI-model choice per shot recorded; reference rebuilds carry a named edit anatomy.

## Sources

Reference URLs provided for this mode are listed here. When a cited source conflicts with a default above, the source wins — record the override and why.
