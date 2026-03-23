## Early Wireframe Exploration

Before refining the implemented screens, I mapped the workflow in low-fidelity wireframes to think through screen transitions, stock-handling steps, and expiry-related flows.

![Wireframe overview](./docs/wireframe-overview.jpg)

## App Screens

### 1. Entry and Sign-in
The app starts with a simple sign-in flow designed for quick access in day-to-day store operations.

<p>
  <img src="./docs/signin-screen.png" width="32%" />
</p>


### 2. Home and Product Search
The home screen surfaces urgent expiry items and expired-product visibility immediately, reducing the chance that high-risk stock is missed during daily operations.

It also supports quick product lookup for fast in-store handling.
<p>
  <img src="./docs/home-screen.jpg" width="32%" />
  <img src="./docs/search-results.jpg" width="32%" />
</p>

### 3. Product Details
The product detail screen provides core product information and acts as the entry point for stock-related actions.
<p>
  <img src="./docs/product-details.jpg" width="32%" />
</p>

### 4. Stock Creation
Stock can be registered with quantity, expiry date, location, and optional discount information.
<p>
  <img src="./docs/add-stock.jpg" width="32%" />
</p>


### 5. Stock Management Improvements
One of the main UI/UX improvements in this version was reducing the need to move into a separate stock detail step for common actions.

Users can now manage stock more directly from the stock list through swipe-based interactions and in-place editing flows.

<p>
  <img src="./docs/stock-swipe.jpg" width="32%" />
  <img src="./docs/stock-update.jpg" width="32%" />
</p>
This change was intended to reduce taps, shorten repetitive workflows, and make operational stock handling more intuitive.
### 6. Expiry Tracking

The expiry tracking screen groups stock by time-to-expiry so staff can prioritise action more clearly.

This helps distinguish items that are approaching expiry from those that require immediate intervention.
<p>
  <img src="./docs/expiry-1-2-weeks.jpg" width="32%" />
  <img src="./docs/expiry-0-7-days.jpg" width="32%" />
</p>
### 7. Expired Product Follow-up

A separate expired-products flow was added so items do not disappear from the operational workflow once they pass the expiry date.

This supports follow-up actions such as assessment, discount outcome tracking, and final loss handling.

![Expired products tab](./docs/expired-tab.png)