# Owlverload - Expiry Tracking for Retail Operations

A React Native mobile app designed to improve inventory visibility, expiry tracking, and day-to-day stock handling in a real retail environment.

## Overview

Owlverload started from a practical store problem: expiry-related stock handling was repetitive, easy to miss, and too dependent on manual checking.

Rather than building a generic inventory demo, I designed the app around workflows that actually happen during day-to-day retail operations, such as:

- searching for products quickly
- checking stock information
- creating and updating stock entries
- handling near-expiry and expired items
- updating product details
- reducing unnecessary taps for frequent operational tasks

After building the first version, I used it in practice and kept refining the app based on what felt slow, awkward, or inefficient in real work.

This refactoring phase focused heavily on improving UI/UX, reducing unnecessary screen transitions, and making repeated stock-handling tasks more intuitive.

## v1 Refactoring Focus

The main goal of this iteration was to reduce operational friction.

I paid close attention to questions such as:

- how many taps are needed to reach an important action?
- does the user have to move through too many screens for a simple task?
- can frequent actions be completed more directly?
- can expiry-related decisions be handled more clearly and consistently?

The result was a set of workflow and interface improvements aimed at making the app faster and more practical for real store use.

## Key Improvements

### 1. Better navigation after stock creation and update

After completing stock creation or stock update, users often needed to move to another relevant screen immediately.

To make that transition easier, I added bottom navigation to the resulting screens so users could move more comfortably without unnecessary backtracking.

This was intended to make the flow smoother after task completion and reduce extra movement across the app.

### 2. Direct stock actions from the Stocks screen

Previously, deleting or updating stock required users to go one step deeper into a Stock Detail screen.

That felt too heavy for actions that are frequent and operationally simple.

To reduce those steps, I changed the flow so stock can be handled directly from the Stocks screen:

- added swipe interactions for stock actions
- introduced state-based UI changes to support in-place interaction
- reduced dependency on the Stock Detail page for common tasks

This made stock updates and deletions faster and more direct.

### 3. More efficient multi-stock deletion

I added an external delete action on the Stocks screen so users can remove multiple stock entries more efficiently.

This was designed for repetitive operational cleanup, where handling items one by one would be unnecessarily slow.

### 4. Urgent expiry section on the main screen

I added a dedicated section on the main page for urgent items, meaning products with roughly one week remaining before expiry.

This improves visibility for high-priority stock and helps staff notice time-sensitive items earlier without needing to manually search for them.

### 5. Separate tracking flow for expired products

One important problem in the earlier version was that once a product had already expired, it could disappear from the normal working flow.

If a staff member forgot to handle it on the exact day it expired, the item might no longer appear in the filtered list, which created a real operational risk: expired stock could remain on the shelf simply because it was no longer visible in the app.

To address this, I created a separate expired-products tracking section so expired items can still be reviewed and managed after they pass the expiry date.

This allows post-expiry handling such as:

- labeling
- assessment
- follow-up processing
- operational cleanup

## Expired Product Management Flow

I also extended the expired-products flow so staff can manage the outcome more explicitly.

On the expired-products page, users can swipe an item and decide what happened to it operationally.

For example:

- whether the item entered a discount-handling process
- whether it was eventually sold after discounting
- whether it ended up fully expired and wasted

This reflects the reality that near-expiry products do not always end in the same outcome.

Some items can still be rescued through tighter handling, such as starting discounts for products that are already within a one-month risk window.

By separating those outcomes more clearly, the app can produce more meaningful operational data instead of treating everything as a simple expired/not-expired case.

## Reporting Direction

A major reason for adding this classification flow was to support better reporting.

The goal is not only to list expired stock, but to quantify parts of store operation that are often judged only by intuition.

Examples include:

- how much value was saved through discount handling
- how much stock ended as loss
- which items were rescued before full expiry
- which products repeatedly fail to sell even after discounting

This reporting layer will be developed as a separate project, but it comes directly from the stock-management workflow and the operational data structure designed here.

The overall direction is to turn vague operational judgment into measurable outcomes wherever possible.

## Core Features

- Product and inventory lookup
- Product detail updates
- Stock creation and stock updates
- Expiry-date stock tracking
- Urgent near-expiry item visibility
- Separate expired-item tracking flow
- Swipe-based stock actions
- Faster stock deletion workflow
- Multi-item operational cleanup support
- Bottom-navigation-based movement after stock actions
- Mobile-first workflow support for retail operations
- Image upload support for product management

## Design Approach

This project was shaped by actual usage, not just initial planning.

The first version established the basic inventory and expiry workflow.  
This refactored version focused much more on:

- reducing taps
- simplifying screen flow
- making repeated actions faster
- improving action visibility
- making stock handling more intuitive
- supporting more realistic expiry outcomes

In short, this iteration focused less on adding surface-level features and more on making the workflow operationally efficient.

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

```bash
.
├── android/
├── ios/
├── src/
├── package.json
├── tsconfig.json
└── README.md
