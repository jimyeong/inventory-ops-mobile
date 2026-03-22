# Owlverload - Expiry Tracking for Retail Operations

A React Native mobile app built to improve inventory visibility, expiry tracking, and day-to-day stock handling in a real retail environment.

## Overview

This project started from a practical problem: expiry-related stock handling in a store environment was repetitive, easy to miss, and too dependent on manual checking.

Instead of treating it as a generic inventory demo, I built the app around workflows that actually happen in day-to-day retail operations:

- searching products quickly
- checking stock information
- registering expiry-related stock
- updating product details
- handling discounted or expired items
- reducing unnecessary taps for frequent actions

As I used the app during real work, I kept adjusting the UI and navigation based on what felt slow, awkward, or operationally inefficient.

## What changed after real usage

The first version worked, but after using it in practice, several friction points became obvious.

I updated the app to better reflect how the work is actually done:

- simplified the screen flow to reduce unnecessary movement between screens
- reorganized frequent actions around bottom navigation
- reduced process length for common stock-handling tasks
- improved inventory deletion flow so items do not always need to be managed from the detail page
- added swipe-based interactions to support faster stock handling
- made it possible to remove multiple stock entries more efficiently during operational work

These changes came from direct usage feedback rather than purely visual redesign.

## Expiry workflow improvements

One of the main improvements was separating expiry-related outcomes more realistically.

In practice, near-expiry stock does not always end the same way:

- some items expire and are discarded
- some items are moved into an expiry list, discounted, and eventually sold
- some discount strategies reduce loss and recover part of the value

To reflect that, I expanded the expiry handling flow so that items can be categorized more clearly, including whether they were:

- sold after discount
- fully expired / wasted

This makes the data more useful beyond simple stock tracking.

## Reporting direction

Based on that workflow change, I started shaping the data model toward reporting as well.

The goal is not only to list expired items, but to support questions like:

- how much stock was actually lost?
- how much value was recovered through discounting?
- which items repeatedly fail to sell even after discounting?
- how much was saved by intervening before full expiry?

The report/dashboard view is being split into a separate project, but it came directly from this stock-management workflow.

Example reporting direction includes:

- expired vs sold-after-discount tracking
- rescued value through discounted sales
- product-level loss analysis
- near-expiry rescue reporting

## Core Features

- Product and inventory lookup
- Product detail updates
- Expiry-date stock tracking
- Swipe-based stock actions
- Faster stock deletion workflow
- Operationally simplified navigation
- Mobile-first retail workflow support
- Image upload support for product management

## Example operational improvements

### Before
Some actions required going deeper into the detail screen even when the task was repetitive and operationally simple.

### After
The flow was adjusted so that common actions could be completed faster, with less screen movement and less dependency on the detail page.

This included:
- more direct access through navigation restructuring
- swipe interaction for stock handling
- support for batch-like operational cleanup
- clearer expiry result classification

## Tech Stack

### Mobile
- React Native
- TypeScript
- React Navigation
- Axios

### Backend
- Go
- REST API
- MySQL

### Infrastructure
- Cloudflare R2 / CDN
- Image upload handling
- Environment-based configuration

## Project Structure

```text
.
├── android/
├── ios/
├── src/
├── package.json
├── tsconfig.json
└── README.md

```


Screens / UI
This repository focuses on the mobile stock-management application.
The reporting dashboard direction shown in the mockup is based on the operational data produced by this workflow, but it will be split into a separate project.


