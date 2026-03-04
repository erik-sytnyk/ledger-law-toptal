LedgerLaw.ai

AI-Powered Legal Intelligence Platform

Developer Summary & Technical Specification

Client

The Ledger Law Firm, A Professional Law Corporation

Principal

Emery Brett Ledger, Esq. — Founding Partner

Domain

ledgerlaw.ai (registered Feb 2026)

Firm Website

ledgerlaw.com

Location

Rancho Santa Margarita, CA

Document Date

February 11, 2026

Document Version

v2.0 — Post-Rebrand

Classification

Confidential — Attorney Work Product

1. Executive Summary

LedgerLaw.ai is a proprietary AI-powered legal intelligence platform built for personal injury litigation. It generates Colossus-optimized demand letters, predicts carrier objections, performs case valuation, and provides a full suite of AI-assisted legal tools — all in a single web application.

The platform directly competes with EvenUp ($1B+ valuation, $500+/demand), DemandPro, ProPlaintiff, Precedent, Tavrn, and others — at a fraction of the cost (~$12/demand via Anthropic API). The key differentiator is the proprietary Reverse Colossus™ Engine, which reverse-engineers insurance carrier claim evaluation software to optimize demand formatting for maximum settlement authority.

2. Current State — What’s Built

The complete frontend prototype is built as a single-file React application (479 lines, 68KB). It is a fully interactive, production-quality UI with 18 functional pages, embedded data models, and simulated AI workflows. It is ready for backend integration.

2.1 Deliverables Provided to Developer

Deliverable

Status

Details

UI Prototype (React JSX)

✅ Complete

LedgerLaw-ai-v2.jsx — 18 pages, full interactive app

IT Deployment Guide

✅ Complete

18-section .docx with all code snippets, schema, configs

Database Schema

✅ Complete

PostgreSQL: cases, demands, documents, users, carriers

Backend API Design

✅ Complete

Express.js + Anthropic Claude API integration

Auth Architecture

✅ Complete

Clerk-based roles: Partner, Associate, Paralegal, etc.

Branding Assets

✅ Complete

SVG logo mark, color palette, DM Sans + Playfair Display

Competitive Analysis

✅ Complete

8-competitor analysis: EvenUp, DemandPro, ProPlaintiff, etc.

Toptal Project Brief

✅ Complete

Developer hiring brief with 5-7 day timeline

3. Application Pages (18 Total)

3.1 Core Workflow

#

Page

Route Key

Description

1

Dashboard

dash

Hero banner with LedgerLaw.ai logo, 4 stat cards (active cases, demands generated, settled, avg time), recent cases table, AI engine status panel, monthly cost savings vs competitors

2

Cases

cases

Filterable case list with search, status badges, carrier badges. 7 sample cases with full metadata (client, type, carrier, medicals, demand, policy, attorney)

3

Intake Screening

intake

AI-powered new case intake form. Simulates viability assessment, value range prediction, Colossus prediction, red flag detection. Outputs: STRONG/WEAK + accept/reject recommendation

4

New Demand

new

4-step wizard: Case Info → Upload Medical Records → Customize (tone, Colossus level, verdict inclusion, amount strategy) → Generated output with stats (pages, ICD codes, exhibits, redactions)

3.2 Competitive Edge (Proprietary)

#

Page

Route Key

Description

5

Reverse Colossus™

colossus

Proprietary engine. Carrier selector (14 carriers with Colossus/ClaimIQ/proprietary AI info + adherence levels). 3 tabs: 10-step demand optimizer, 19 value drivers with weights, documentation checklist (15 items)

6

Carrier Objections

objections

AI predicts 5 objection categories (treatment gaps, pre-existing, property damage mismatch, delayed imaging, subjective pain) with severity + counter-argument for each

7

Case Valuation

casevalue

9-field assessment form. Outputs: low/expected/high value range + 6 strength indicator bars (liability, documentation, Colossus score, venue, attorney record, treatment consistency)

3.3 Research & Analysis Tools

#

Page

Route Key

Description

8

Med Chronology

chrono

AI-generated treatment timeline from medical records. 6 sample events with dates, providers, types, diagnoses, medications

9

Damages Calculator

damages

Live-calculating economic damages (5 fields: past/future medical, past/future wages, property). P&S multipliers (1.5x-5x). Dynamic demand range output

10

Verdict Research

verdicts

Searchable verdict database (6.5M+ cases). Filterable by jurisdiction. 6 sample verdicts with case name, year, venue, type, injuries, award amount

11

ICD-10 Code Engine

icd

24 PI-specific ICD-10 codes with severity levels and Colossus point values. Interactive selection with live Colossus score calculation. Searchable by code or description

3.4 AI-Powered Tools

#

Page

Route Key

Description

12

AI Case Chat

chat

Claude-powered conversational interface. Upload documents and ask questions. Simulated response with case-specific analysis including Colossus scoring and comparable verdicts

13

eDiscovery

ediscovery

Document upload with AI auto-tagging. 7 sample documents with page counts, tags (Medical, Liability, Carrier, Imaging), relevance scoring (High/Med/Low)

14

Contract Review

contracts

AI clause analysis. 5 sample clauses with risk levels (HIGH/MED/LOW), issue descriptions, and recommended fixes. Powered by Anthropic Cowork Legal Plugin

15

AI Drafts Suite

drafts

9 document types: Demand Letter, Discovery Response, Mediation Brief, Settlement Agreement, Motion, Client Letter, Arbitration Brief, Expert Witness Letter, Lien Negotiation

3.5 Administration

#

Page

Route Key

Description

16

Team & Users

users

6 team members with @ledgerlaw.ai emails. Roles: Partner, Sr. Associate, Associate, Paralegal, Case Manager, Legal Assistant. Active/Invited status

17

Settings

settings

Firm info, AI model selection (Claude Sonnet 4 / Opus 4.5), default tone, Colossus optimization mode, auto-redact PII toggle, letterhead upload

4. Technical Architecture

4.1 Technology Stack

Layer

Technology

Notes

Frontend

React 18 + Vite

Single-file JSX prototype; split into components at deploy

Styling

Inline styles + CSS vars

DM Sans (body), Playfair Display (headings), JetBrains Mono (code)

Backend

Node.js + Express.js

~60 lines. Routes for demand generation, case CRUD, AI chat

AI Engine

Anthropic Claude API

claude-sonnet-4-20250514. Server-side only. Never expose key.

Database

Supabase (PostgreSQL)

Tables: cases, demands, documents, users, carriers, verdicts

Authentication

Clerk (React SDK)

MFA enabled. Roles: Partner, Associate, Paralegal, etc.

Hosting

Vercel (Pro)

Auto-deploy from GitHub. Custom domain: ledgerlaw.ai

Domain

ledgerlaw.ai

Registered Feb 2026. DNS: Vercel CNAME

CRM Sync

Salesforce (jsforce)

Optional. Bi-directional case sync

Doc Generation

docx npm package

Demand letters on firm letterhead (.docx output)

5. Embedded Data Models

5.1 Carrier Intelligence Database (14 carriers)

Each carrier entry includes: claim evaluation software (Colossus / ClaimIQ / Internal AI), adherence level (Very High to Low), and tactical intelligence notes for adjusters.

Allstate: Colossus, Very High adherence — most wedded, will litigate before exceeding range

State Farm: ClaimIQ (Mitchell), Medium — proprietary system, different weighting

GEICO: Internal AI, High — extremely aggressive on soft tissue, prefers litigation

Also includes: Progressive, Farmers, Travelers, USAA, Hartford, Liberty Mutual, Nationwide, MetLife, Erie, Zurich, CA State Auto

5.2 Colossus Value Drivers (19 factors)

Categorized by weight: HIGHEST (Permanent Injury), PRIMARY (ICD Severity), HIGH (AMA Rating, Surgery, Hospital, Demonstrable Evidence, Prognosis), MEDIUM (Treatment Duration, ADLs, Loss of Enjoyment, Medication, PT), CONDITIONAL (Mental Health), NEGATIVE (Treatment Gaps, Pre-Existing), MODIFIER (Seatbelt, Attorney Record, Venue, Aggravated Liability).

5.3 ICD-10 Code Database (24 PI codes)

Each code includes: ICD-10 code, description, severity level (Mild through V.Sev), and Colossus point value (2-8). Codes span cervical/thoracic/lumbar injuries, fractures, TBI, PTSD, depression, insomnia, and orthopedic injuries (rotator cuff, ACL, MCL).

5.4 Case Types (13 supported)

Motor Vehicle, Truck, Motorcycle, Rideshare, Bicycle, Pedestrian, Slip & Fall, Premises Liability, Dog Bite, Product Liability, Workplace Injury, Wrongful Death, Mass Tort.

6. Design System & Branding

6.1 Logo

SVG logo mark: geometric "L" letterform + hexagonal AI motif with node accent. Rendered in sidebar (28x28) and Dashboard hero (56x56). Color: #5BA4D9 (sky blue) on dark navy background.

6.2 Color Palette

Token

Hex

Usage

Primary (Steel Blue)

#3D6B8E

Buttons, links, active states, primary accents

Sidebar (Navy)

#1B2838

Sidebar background, heading text, title bar

Sidebar Accent

#5BA4D9

Logo, active nav highlight, avatar ring

Sage Green

#4D7A65

Settled status, positive secondary indicators

Gold

#8B7332

Proprietary badges, warning-adjacent indicators

Success Green

#2A8650

Confirmed, active, connected states

Error Red

#B83A2D

High severity, rejection, critical alerts

Warning Amber

#A67B0C

Review needed, medium severity, treatment gaps

Purple

#6B4A9E

Settled status badge, ICD engine accent

Blue

#2B72B0

eDiscovery badge, Cowork plugin indicator

Background

#F3F5F8

Main content area background

Surface

#FFFFFF

Card backgrounds

Text Primary

#1A2A38

Main body text

Text Muted

#6A8498

Labels, secondary information, timestamps

6.3 Typography

Display: Playfair Display (500/600/700) — page headings, sidebar brand name, hero text

Body: DM Sans (400/500/600/700) — all UI text, form labels, table data, navigation

Code: JetBrains Mono (400/500) — ICD-10 codes, technical identifiers

7. Deployment Plan

Target: 5–7 working days. Budget: $2,000–$4,000 (Toptal hourly). Developer receives all files on Day 1.

Day

Milestone

Tasks

Day 1

Setup & Deploy

Init Vite + React, integrate JSX prototype, push to GitHub, deploy to Vercel, confirm rendering at preview URL

Day 2

Database & Auth

Supabase PostgreSQL schema, Clerk auth with firm domain, RBAC (Partner/Associate/Paralegal/CaseMgr/Admin)

Day 3

Backend & AI

Express.js API, Anthropic Claude integration (server-side only), rate limiting (100 req/15min), security middleware

Day 4

Domain & Integrations

Connect ledgerlaw.ai domain (Vercel CNAME), env vars, Salesforce sync (optional), .docx generation, PII auto-redaction

Days 5–7

QA & Handoff

18-item test checklist, auth verification, API key audit, handoff call, deviation documentation

8. Security & Compliance

Anthropic API key must ONLY exist in server-side environment variables — never exposed to browser

Auto-redaction of SSN and DOB from all text before sending to AI

Clerk MFA enabled for all user accounts

HTTPS only (Vercel handles automatically)

Rate limiting on all API endpoints (100 requests per 15 minutes)

HIPAA configuration checklist in deployment guide (Section 14)

Separate HIPAA compliance consultant and penetration testing to be engaged post-deployment

9. Competitive Position

Competitor

Valuation

Price/Demand

LedgerLaw.ai Advantage

EvenUp

$1B+

$500+

Reverse Colossus™, 40x lower cost, attorney-built

DemandPro

Private

$400+

Broader tool suite (18 pages vs single-purpose)

ProPlaintiff

Private

$2,750/mo

No monthly minimum, pay-per-use API model

Precedent

Private

$500/mo

Colossus-specific optimization vs generic AI

Tavrn

$2M seed

$200+

Proprietary carrier intelligence database

Supio

Private

$200+

Full platform (chat, eDiscovery, contracts, drafts)

LedgerLaw.ai

—

~$12

All features above in one platform at 40x lower cost

10. File Manifest

File

Size

Description

LedgerLaw-ai-v2.jsx

68 KB

Complete React prototype — 18 pages, all interactive

Toptal-Project-Brief.md

8 KB

Developer hiring brief with scope and timeline

Ledger-DemandAI-IT-Deployment-Guide.docx

63 KB

18-section deployment guide with code snippets

DemandAI-Competitive-Analysis.docx

53 KB

8-competitor analysis with pricing and features

DemandAI-Deployment-Options.docx

47 KB

Hosting and infrastructure options comparison

LedgerLaw-Developer-Summary.docx

This file

Technical specification and developer handoff

— End of Document —

Prepared by LedgerLaw.ai | The Ledger Law Firm | Confidential