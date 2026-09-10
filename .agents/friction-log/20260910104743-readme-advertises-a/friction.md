---
title: 'README advertises a solution branch absent from upstream refs'
severity: 'minor'
---

## Expected Behavior
The documented solution branch can be fetched and inspected.

## Current Behavior
On 2026-09-10, a fetch of all heads and git ls-remote origin exposed only main at a481667cdfc049b66d961ad31cf346f37ab4d4b0. README and Academy lessons advertise solution.

## Possible Solution
Publish the reference branch or correct the docs and link available lesson solutions.

## Minimal Reproducible Example
Run git ls-remote origin and git switch solution in this repository. No solution ref is listed.

## Context
Found while mining the course for a research walkthrough. Remote origin is vercel-labs/academy-software-factory. No issue published.
