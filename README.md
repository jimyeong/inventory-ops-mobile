# React Native Expiry Tracker

A React Native mobile app for inventory tracking, expiry management, and retail stock operations.

## Overview

This project was built around a practical retail workflow: tracking products, monitoring expiry dates, updating stock information, and reducing manual friction in day-to-day store operations.

The app focuses on operational clarity rather than cosmetic complexity. It is designed to support tasks such as:

- inventory lookup
- stock updates
- product detail management
- expiry-date tracking
- retail workflow support

## Why I built this

I wanted to build a product around a real operational problem rather than a purely abstract demo.

Working close to day-to-day retail processes made it clear that stock handling, expiry management, and product updates are often repetitive, error-prone, and dependent on manual checks. This app was built as a step toward making those workflows more visible, trackable, and manageable on mobile.

## Features

- View product and inventory information
- Update product details
- Track expiry-related stock handling
- Upload product images
- Support operational flows for retail environments
- Mobile-first workflow for day-to-day use

## Tech Stack

### Mobile
- React Native
- TypeScript
- React Navigation
- Axios

### Backend
- Go
- REST API

### Infrastructure / Storage
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