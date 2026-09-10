---
title: 'Intake accepts unrelated label additions while factory label remains'
severity: 'minor'
---

## Expected Behavior
Admission matches the intended trigger label event, or documents repeated admission explicitly.

## Current Behavior
agent/channels/github.ts checks action labeled and the complete label list for FACTORY_LABEL, without checking which label was added. An unrelated label event can therefore pass while factory is already present.

## Possible Solution
Check the event-added label, or document the intended behavior and verify duplicate-work protection.

## Minimal Reproducible Example
Inspect onIssue with action labeled, labels containing factory and another label, and a trusted non-bot sender. The predicate passes regardless of which label was added.

## Context
Source-inspection finding at a481667. Live webhook and Eve session deduplication were not tested. No remote issue published.
