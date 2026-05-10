---
title: CTF Alert
subtitle: Cybersecurity Event Tracking & CTF Notification Platform
description: A mobile-first cybersecurity platform for discovering, tracking, submitting, and managing Capture the Flag competitions across international, national, and inter-university scopes.
heroImage: "![[../attachments/ChatGPT Image May 10, 2026, 02_36_14 PM.png]]"
category: Cybersecurity / Web Application
date: 2026-04
status: ongoing
tags:
  - React
  - TypeScript
  - CTF
  - Cybersecurity
  - Capacitor
  - Tailwind_CSS
---

### Project Overview
The CTF Alert project was designed as a cyber-themed event monitoring platform for Capture the Flag competitions. It allows users to browse live and upcoming CTF events, view contest details, save important competitions, and submit new events for review. The interface follows a terminal-inspired design style, giving the application a strong cybersecurity identity while keeping the user experience clean and organized.

The platform supports different competition scopes, including international, national, and inter-university events. It also includes an admin review system where submitted competitions can be checked before approval, making the system useful for both regular participants and event managers.

### Key Features

• CTF Event Dashboard: Displays running and upcoming CTF competitions with event title, organizer, status, countdown, deployment date, scope, and reward information.

• Scope-Based Filtering: Organizes contests into international, national, and inter-university categories so users can quickly find relevant competitions.

• User and Admin Login Interface: Provides a role-selection login screen for normal users and administrators.

• Event Submission System: Allows users to submit new CTF events with core information such as event title, organizer, mission briefing, start time, end time, and competition scope.

• Admin Review Queue: Provides an admin-side review panel where pending submissions can be approved or rejected after manual verification.

• Saved Contest Management: Lets users bookmark CTF competitions and manage saved events from a dedicated saved operations section.

• Alert Preference Controls: Includes reminder and notification settings such as 24-hour reminders, new contest alerts, and security update preferences.

• Mobile-Ready Structure: Uses Capacitor configuration, making the project suitable for Android app deployment in addition to the web version.
### Technical Stack
The project was built using React and TypeScript with Vite as the development and build tool. Tailwind CSS is used for styling, while custom UI components such as buttons, cards, and badges help maintain a consistent design system. Lucide React icons are used throughout the interface, and Motion animations are used to create smooth screen transitions and interactive effects.

For mobile compatibility, the project includes Capacitor Android support with the app identity configured as `com.terminal.ctf`. The current data flow is based on mock TypeScript constants, including sample CTF events, submitted events, and saved contests. This makes the project a strong frontend prototype that can later be extended with real authentication, database storage, APIs, and push notification services.
